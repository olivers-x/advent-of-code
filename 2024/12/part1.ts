import { readInput } from "./input.ts";

let map: string[][];
let size: number;
let turns = 0;

const DIRECTIONS = [
  { x: 0, y: 1 }, // RIGHT
  { x: -1, y: 0 }, // DOWN
  { x: 0, y: -1 }, // LEFT
  { x: 1, y: 0 }, // UP
];

let perimeter = 0;
let area = 0;

function walk(symbol: string, x: number, y: number) {
  //   if (x < 0 || y < 0 || x >= size || y >= size) return;

  const visitedKey = "." + symbol;

  if (map[x][y] === symbol) area++;

  DIRECTIONS.forEach((dir) => {
    const dx = x + dir.x;
    const dy = y + dir.y;

    map[x][y] = visitedKey;

    if (dx < 0 || dy < 0 || dx >= size || dy >= size) {
      perimeter++;
      return;
    }

    if (map[dx][dy] === symbol) {
      walk(symbol, dx, dy);
    } else if (map[dx][dy] !== visitedKey) {
      perimeter++;
    }
  });
}

function findNext() {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (!map[i][j].startsWith(".")) return { x: i, y: j };
}

function part1(input: string) {
  const lines = input.split("\n");
  map = lines.map((line) => line.split(""));
  size = map.length;

  console.table(map);

  let total = 0;

  for (let corner; (corner = findNext()); ) {
    const { x, y } = corner;

    const symbol = map[x][y];
    area = 0;
    perimeter = 0;

    walk(symbol, x, y);

    console.log(symbol, "A:", area, "P:", perimeter);

    total += area * perimeter;
  }

  //   console.table(map);
  console.log(total);
}

if (import.meta.main) {
  part1(readInput().trimEnd());
}
