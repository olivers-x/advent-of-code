import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { read } from "../lib.mjs";

let map;
let start;
let end;
let rows;
let cols;

const key = (row, col) => `${row},${col}`;
const getRowCol = (key) => key.split(",").map(Number);

function findSE(maze) {
  rows = maze.length;
  cols = maze[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === "S") {
        start = [row, col];
      } else if (maze[row][col] === "E") {
        end = [row, col];
      }
    }
  }

  if (!start) {
    throw new Error("No starting point 'S' found in the maze");
  }
}

function dijkstra(maze, start, end, pathSymbol, maxDistance = Infinity) {
  const rows = maze.length;
  const cols = maze[0].length;

  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  const pq = new MinPriorityQueue((a) => a[1]);
  const distances = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );

  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const endSymbol = maze[endRow][endCol];

  distances[startRow][startCol] = 0;
  pq.enqueue([startRow, startCol], 0);

  while (!pq.isEmpty()) {
    const [currentRow, currentCol] = pq.dequeue();

    const k = key(currentRow, currentRow);

    if (currentRow === endRow && currentCol === endCol) break;

    for (const [dr, dc] of directions) {
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (
          maze[newRow][newCol] === pathSymbol ||
          maze[newRow][newCol] === endSymbol
        ) {
          const newDist = distances[currentRow][currentCol] + 1; // All moves cost 1

          if (newDist < distances[newRow][newCol] && newDist <= maxDistance) {
            distances[newRow][newCol] = newDist;

            pq.enqueue([newRow, newCol], newDist);
          }
        }
      }
    }
  }

  const found = distances[endRow][endCol] !== Infinity;

  return { distances, found };
}

function getPath(distances) {
  const path = {};

  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (distances[i][j] !== Infinity) {
        path[key(i, j)] = distances[i][j];
      }

  return path;
}

let SAVE_LIMIT = 100;
let SHORTCUT_DISTANCE = 20;

function part2(input) {
  map = input.split("\n").map((row) => row.split(""));

  findSE(map);

  const { distances } = dijkstra(map, start, end, ".", Infinity);

  const path = getPath(distances);

  function getPossibleShortcutEnds(point) {
    const [x, y] = getRowCol(point);
    const currentD = path[point];

    const r = [];
    for (let dest in path) {
      const [px, py] = getRowCol(dest);
      const dxdy = Math.abs(px - x) + Math.abs(py - y);
      if (dxdy > SHORTCUT_DISTANCE) continue;
      if (dxdy < 1) continue;

      if (path[dest] > currentD && path[dest] - currentD - dxdy >= SAVE_LIMIT) {
        r.push(dest);
      }
    }

    return r;
  }

  let saves = [];
  const savesByDistance = {};

  loop1: for (let point in path) {
    const ends = getPossibleShortcutEnds(point);
    const [x, y] = getRowCol(point);

    if (ends.length) {
      const distances = ends.map((end) => {
        const [px, py] = getRowCol(end);
        const dxdy = Math.abs(px - x) + Math.abs(py - y);
        return path[end] - (path[point] + dxdy);
      });
      distances.forEach((d) => {
        savesByDistance[d] ??= 0;
        savesByDistance[d]++;
      });

      saves.push({
        from: point,
        n: ends.length,
      });
    }
  }

  const result = saves.map((s) => s.n).reduce((acc, n) => acc + n, 0);
  return result;
}

console.log(part2(read()));
