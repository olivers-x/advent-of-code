import { read } from "../lib.mjs";

function findAllPathsWithLeastTurns(mazeString) {
  // Parse the maze string into a grid and locate start and end positions
  const maze = mazeString
    .trim()
    .split("\n")
    .map((row) => row.split(""));
  const rows = maze.length;
  const cols = maze[0].length;

  let start = null,
    end = null;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === "S") start = [r, c];
      if (maze[r][c] === "E") end = [r, c];
    }
  }

  if (!start || !end) throw new Error("Start (S) or End (E) position missing.");

  // Directions (up, right, down, left) with corresponding deltas
  const directions = [
    [-1, 0, "U"], // Up
    [0, 1, "R"], // Right
    [1, 0, "D"], // Down
    [0, -1, "L"], // Left
  ];

  // Manhattan distance function
  const manhattanDistance = (r, c, er, ec) =>
    Math.abs(r - er) + Math.abs(c - ec);

  // BFS queue: [row, col, path, direction, turns]
  const queue = [[start[0], start[1], "", null, 0]];
  const visited = new Map(); // Track visited positions with minimal turns

  let allPaths = [];
  let minTurns = Infinity;

  while (queue.length > 0) {
    // Sort moves greedily based on Manhattan distance
    queue.sort((a, b) => {
      const distA = manhattanDistance(a[0], a[1], end[0], end[1]);
      const distB = manhattanDistance(b[0], b[1], end[0], end[1]);
      return distA - distB;
    });

    const [r, c, path, prevDir, turns] = queue.shift();

    // Stop if we reach the end
    if (r === end[0] && c === end[1]) {
      if (turns < minTurns) {
        minTurns = turns;
        allPaths = [{ path, turns }];
      } else if (turns === minTurns) {
        allPaths.push({ path, turns });
      }
      continue;
    }

    for (const [dr, dc, dir] of directions) {
      const nr = r + dr,
        nc = c + dc;

      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        maze[nr][nc] !== "#"
      ) {
        const newTurns =
          prevDir === null || prevDir === dir ? turns : turns + 1;

        const key = `${nr},${nc},${dir}`;
        if (!visited.has(key) || visited.get(key) > newTurns) {
          visited.set(key, newTurns);
          queue.push([nr, nc, path + dir, dir, newTurns]);
        }
      }
    }
  }

  return allPaths;
}

console.log(findAllPathsWithLeastTurns(read()));
