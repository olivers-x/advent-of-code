import { readFileSync } from "fs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

function readMaze(filePath) {
  return readFileSync(filePath, "utf8").trim().split("\n");
}

const filePath = process.argv[process.argv.length - 1];
if (!filePath) {
  console.error("Usage: bun run mazeSolver.js <file-path>");
  process.exit(1);
}

function dijkstra() {
  const maze = readMaze(filePath);
  const dx = new Int8Array([1, 0, -1, 0]);
  const dy = new Int8Array([0, 1, 0, -1]);
  const height = maze.length;
  const width = maze[0].length;
  let startX, startY;
  let x = 0 | 0,
    y = 0 | 0,
    nx = 0 | 0,
    ny = 0 | 0,
    dir = 0 | 0,
    cost = 0 | 0,
    prevCost = 0 | 0,
    key = 0 | 0,
    d;
  outer: for (x = 1; x < width - 1; x++) {
    for (y = height - 2; y > 0; y--) {
      if (maze[y][x] === "S") {
        startX = x;
        startY = y;
        break outer;
      }
    }
  }

  const costMap = Array(4);
  let tempArray, tempIntArray;
  for (d = 0; d < 4; d++) {
    costMap[d] = tempArray = Array(height);
    for (y = 0; y < height; y++) {
      tempArray[y] = tempIntArray = new Int32Array(width);
      for (x = 0; x < width; x++) {
        tempIntArray[x] = 2147483647;
      }
    }
  }

  const pq = new MinPriorityQueue((a) => a.cost);
  pq.enqueue({ x: startX, y: startY, dir: 0, cost: 0 });

  while (!pq.isEmpty()) {
    key = pq.dequeue();
    x = key.x;
    y = key.y;
    dir = key.dir;
    if (costMap[dir][y][x] < 2147483647) continue;
    costMap[dir][y][x] = cost = key.cost;
    //console.log(`${key}, ${x}, ${y}, ${dir}, ${cost}`);

    if (maze[y][x] === "E") {
      break;
    }

    for (d = 0; d < 4; d++) {
      if (d === dir) {
        if (maze[(ny = y + dy[d])]?.[(nx = x + dx[d])] !== "#") {
          pq.enqueue({ x: nx, y: ny, dir, cost: cost + 1 });
        }
      } else if (costMap[d][y][x] === 2147483647) {
        pq.enqueue({ x, y, dir: d, cost: cost + 1000 });
      }
      //console.log(key);
    }
  }

  const visited = new Set();
  const queue = [];
  key = (y << 8) | x;

  for (d = 0; d < 4; d++) {
    if (costMap[d][y][x] < 2147483647) {
      queue.push((d << 16) | key);
      visited.add(key);
    }
  }

  while (queue.length > 0) {
    key = queue.pop();
    x = key & 255;
    y = (key >> 8) & 255;
    dir = key >> 16;

    for (d = 0; d < 4; d++) {
      if (
        (ny = y - dy[d]) >= 0 &&
        ny < height &&
        (nx = x - dx[d]) >= 0 &&
        nx < width &&
        !visited.has((key = (ny << 8) | nx)) &&
        (((cost = costMap[d][ny][nx]) + 1 === (prevCost = costMap[dir][y][x]) &&
          dir === d) ||
          (dir !== d && cost + 1001 === prevCost))
      ) {
        visited.add(key);
        queue.push((d << 16) | key);
      }
    }
  }

  return visited.size;
}

console.log(dijkstra());
