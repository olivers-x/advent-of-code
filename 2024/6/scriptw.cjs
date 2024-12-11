const fs = require("fs");
const readline = require("readline");

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  // 1686

  const sum = (a, b) => a + b;

  async function readFileLineByLine(filePath) {
    const lines = [];

    try {
      const fileStream = fs.createReadStream(filePath);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity, // Recognizes all instances of CR LF as line breaks
      });

      for await (const line of rl) {
        lines.push(line.split(""));
      }
    } catch (err) {
      console.error(`Error reading file: ${err.message}`);
    }

    return lines;
  }

  let width;
  let height;
  let maxTurns;

  function getStartPosition(map = []) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "^") {
          map[i][j] = ".";

          height = map.length;
          width = map[i].length;

          maxTurns = Math.floor(height + width - width / 3);

          return { x: i, y: j };
        }
      }
    }
  }

  const sharedCache = {};
  let sharedMap;
  let stuckCount = 0;
  let turns = 0;

  const DIRECTIONS = [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ];
  const visited = {};

  function directionToChar(direction) {
    if (direction.x === 0) {
      return "-";
    }

    if (direction.y === 0) {
      return "|";
    }
  }

  function visit(x, y, direction) {
    if (visited[[x, y]]) {
      visited[[x, y]] = "+";

      return;
    }

    visited[[x, y]] = directionToChar(direction);
  }

  function move(map, x, y) {
    if (x < 0 || y < 0 || x === height || y === width) {
      return;
    }

    const direction = DIRECTIONS[turns % 4];

    const position = [x, y];

    if (map[x][y] === ".") {
      visit(x, y, direction);
      move(map, x + direction.x, y + direction.y);
    }

    if (map[x][y] === "#") {
      turns++;

      visited[position] = undefined;
      move(map, x - direction.x, y - direction.y);
    }
  }

  // Function to run a worker
  function runWorker(map, startX, startY, obstacleX, obstacleY) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: {
          map,
          startX,
          startY,
          obstacleX,
          obstacleY,
        },
      }); // Spawn worker using the same file
      worker.on("message", resolve); // Resolve promise on successful result
      worker.on("error", reject); // Reject promise on error
      worker.on("exit", (code) => {
        // Handle worker exit
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async function main() {
    const fileName = process.argv[process.argv.length - 1];
    const map = await readFileLineByLine(fileName);

    const startPosition = getStartPosition(map);

    move(map, startPosition.x, startPosition.y);

    // remove start position
    delete visited[[startPosition.x, startPosition.y]];

    const possibleObstacles = Object.keys(visited)
      .map((p) => p.split(",").map((n) => parseInt(n, 10)))
      .filter(([x, y]) => map[x][y] !== "#");

    // console.table(map);

    // Run all workers in parallel
    const results = await Promise.all(
      possibleObstacles.map(([x, y]) =>
        runWorker(map, startPosition.x, startPosition.y, x, y)
      )
    );

    console.log(results.reduce(sum, 0));
  }

  main();
} else {
  const DIRECTIONS = [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ];

  let turns = 0;

  const { map, startX, startY, obstacleX, obstacleY } = workerData;

  //   map[obstacleX][obstacleY] = "#";

  function faster_move(x, y) {
    if (turns > 155) {
      parentPort.postMessage(1);
      return;
    }

    if (x < 0 || y < 0 || x === map.length || y === map.length) {
      parentPort.postMessage(0);
      return;
    }

    const direction = DIRECTIONS[turns % 4];

    if (map[x][y] === "#" || (x === obstacleX && y === obstacleY)) {
      // turn right
      turns++;
      //   sharedCache[processId].turns += 1;
      faster_move(x - direction.x, y - direction.y);
    } else {
      // walk
      faster_move(x + direction.x, y + direction.y);
    }
  }

  faster_move(startX, startY);

  parentPort.postMessage(0);
}
