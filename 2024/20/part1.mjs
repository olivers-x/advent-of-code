import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { read } from "../lib.mjs";

let map;
let start;
let end;
let rows;
let cols;
const walls = [];

function findSE(maze) {
  rows = maze.length;
  cols = maze[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === "#") {
        walls.push([row, col]);
      }

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

  // Initialize starting point
  distances[startRow][startCol] = 0;
  pq.enqueue([startRow, startCol], 0);

  while (!pq.isEmpty()) {
    const [currentRow, currentCol] = pq.dequeue();

    // Stop if we've reached the end
    if (currentRow === endRow && currentCol === endCol) break;

    // Explore neighbors
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
        // Check if the neighbor is within bounds and walkable
        const newDist = distances[currentRow][currentCol] + 1; // All moves cost 1

        // If a shorter path is found
        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          previous[newRow][newCol] = [currentRow, currentCol]; // Track the path
          pq.enqueue([newRow, newCol], newDist); // Add neighbor to the priority queue
        }
      }
    }
  }

  // Reconstruct the path from end to start
  const path = [];
  //   let current = [endRow, endCol];

  //   while (current) {
  //     path.push(current);
  //     current = previous[current[0]][current[1]];
  //   }

  //   path.reverse(); // Reverse the path to get it from start to end

  // If the end is unreachable, return an empty path
  if (distances[endRow][endCol] === Infinity) {
    return { path: [], distance: Infinity };
  }

  return { path, distance: distances[endRow][endCol] };
}

function part1(input) {
  map = input.split("\n").map((row) => row.split(""));

  findSE(map);

  const { distance: maxDistance } = dijkstra(map, start, end);

  const saves = walls
    .map((wall) => {
      map[wall[0]][wall[1]] = ".";
      const { distance } = dijkstra(map, start, end);
      map[wall[0]][wall[1]] = "#";
      return maxDistance - distance;
    })
    .filter(Boolean)
    .sort((a, b) => b - a);

  console.log(saves.filter((save) => save >= 100).length);
}

part1(read());
