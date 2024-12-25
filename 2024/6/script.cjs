const fs = require("fs");
const readline = require("readline");

// 1686

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

function prepareMap(map = []) {
  let x, y;
  height = map.length;
  width = map[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === ".") map[i][j] = 0;
      if (map[i][j] === "#") map[i][j] = -1;

      if (map[i][j] === "^") {
        map[i][j] = 0;

        maxTurns = Math.floor(height + width - width / 3);

        x = i;
        y = j;
      }
    }
  }

  return { x, y };
}

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

function visit(x, y) {
  if (visited[[x, y]]) {
    return;
  }

  visited[[x, y]] = true;
}

function move(map, x, y) {
  if (x < 0 || y < 0 || x === height || y === width) {
    return;
  }

  const direction = DIRECTIONS[turns % 4];

  const position = [x, y];

  if (map[x][y] === -1) {
    turns++;

    visited[position] = undefined;
    move(map, x - direction.x, y - direction.y);
  } else {
    visit(x, y);
    move(map, x + direction.x, y + direction.y);
  }
}

function faster_move(x, y) {
  if (turns > maxTurns) {
    stuckCount++;
    return;
  }

  if (x < 0 || y < 0 || x === height || y === width) {
    return;
  }

  const direction = DIRECTIONS[turns % 4];

  if (sharedMap[x][y] === -1) {
    // turn right
    turns += 1;
    let a = x - direction.x;
    let b = y - direction.y;

    faster_move(a, b);
  } else {
    // walk
    faster_move(x + direction.x, y + direction.y);
  }
}

async function main() {
  const fileName = process.argv[process.argv.length - 1];
  const map = await readFileLineByLine(fileName);

  const startPosition = prepareMap(map);

  move(map, startPosition.x, startPosition.y);

  // remove start position
  delete visited[[startPosition.x, startPosition.y]];

  const possibleObstacles = Object.keys(visited)
    .map((p) => p.split(",").map((n) => parseInt(n, 10)))
    .filter(([x, y]) => map[x][y] !== -1);

  sharedMap = map;

  // console.table(sharedMap);
  let prevX = startPosition.x;
  let prevY = startPosition.y;

  possibleObstacles.forEach(([xx, yy], i) => {
    sharedMap[xx][yy] = -1;

    turns = DIRECTIONS.findIndex(
      ({ x, y }) => x === xx - prevX && y === yy - prevY
    );

    if (turns < 0) {
      turns = 0;

      faster_move(startPosition.x, startPosition.y);
    } else {
      faster_move(xx, yy);
    }

    sharedMap[xx][yy] = 0;

    [prevX, prevY] = possibleObstacles[i];
  });

  console.log("part1", possibleObstacles.length + 1);
  console.log("part2", stuckCount);
}

main();
