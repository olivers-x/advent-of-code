import { read } from "../lib.mjs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const BYTES = 1024;
const SIZE = 71;

function dijkstra(maze, start, end) {
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
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  distances[startRow][startCol] = 0;
  pq.enqueue([startRow, startCol], 0);

  while (!pq.isEmpty()) {
    const [currentRow, currentCol] = pq.dequeue();

    if (currentRow === endRow && currentCol === endCol) break;

    for (const [dr, dc] of directions) {
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        maze[newRow][newCol] !== "#"
      ) {
        const newDist = distances[currentRow][currentCol] + 1; // All moves cost 1

        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          previous[newRow][newCol] = [currentRow, currentCol];
          pq.enqueue([newRow, newCol], newDist);
        }
      }
    }
  }

  // Reconstruct the path from end to start
  const path = [];
  let current = [endRow, endCol];

  while (current) {
    path.push(current);
    current = previous[current[0]][current[1]];
  }

  // If the end is unreachable, return an empty path
  if (distances[endRow][endCol] === Infinity) {
    return { path: [], distance: Infinity };
  }

  return { path, distance: distances[endRow][endCol] };
}

function part1(input) {
  const positions = input
    .split("\n")
    .map((line) => line.split(",").map(Number));

  const width = SIZE; // 71;
  const height = SIZE; // 71;

  const map = Array.from({ length: height }, () => Array(width).fill(" "));

  for (let i = 0; i < BYTES; i++) {
    // 1024
    const [x, y] = positions[i];
    map[y][x] = "#";
  }

  const { distance } = dijkstra(map, [0, 0], [width - 1, height - 1]);

  console.log("distance", distance);
}

part1(read());
