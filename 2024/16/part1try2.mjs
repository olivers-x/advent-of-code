import { read } from "../lib.mjs";

const DIRECTIONS = [
  { x: 0, y: 1 }, // right
  { x: -1, y: 0 }, // up
  { x: 0, y: -1 }, // left
  { x: 1, y: 0 }, // down
];

let turns = 0;

function walk(maze, sx, sy) {
  if (maze[sx][sy] === "#") return;

  if (sx === 1 && sy === 13) {
    console.log("end reached");
    return;
  }

  maze[sx][sy] = "x";

  const d = DIRECTIONS[turns % 4];
  const dx = sx + d.x;
  const dy = sy + d.y;

  if (maze[dx][dy] === ".") {
    walk(maze, dx, dy);
  } else {
    turns += 1;

    const prevX = sx - d.x;
    const prevY = sy - d.y;
    walk(maze, prevX, prevY);
  }
}

function part1(maze) {
  const [sx, sy] = [13, 1]; // Start at 'S'
  const [ex, ey] = [1, 13]; // End at 'E'

  maze[sx][sy] = ".";
  maze[ex][ey] = ".";

  const result = walk(maze, sx, sy);

  console.log(result);
  console.table(maze);
}

/// main ///
part1(
  read()
    .split("\n")
    .map((l) => l.split(""))
);
