import { readInput } from "./input.ts";

let map: string[][];
let copy: string[][];
let size: number;

const DIRECTIONS = [
  { x: 0, y: 1 }, // RIGHT
  { x: 1, y: 0 }, // DOWN
  { x: 0, y: -1 }, // LEFT
  { x: -1, y: 0 }, // UP
];

const CORNERS = [
  { x: 1, y: 1 }, // right down
  { x: 1, y: -1 }, // left down
  { x: -1, y: -1 }, // left up
  { x: -1, y: 1 }, // right up
];

let perimeter = 0;
let area = 0;
let corners = 0;

function key(a: number, b: number) {
  return a << (8 + b);
}

function isOutside(x: number, y: number): boolean {
  return x < 0 || y < 0 || x >= size || y >= size;
}

function walk(symbol: string, x: number, y: number) {
  const visitedKey = "." + symbol;

  if (map[x][y] === symbol) area++;

  const edges: number[] = [];

  DIRECTIONS.forEach((dir, index) => {
    const dx = x + dir.x;
    const dy = y + dir.y;

    map[x][y] = visitedKey;

    if (isOutside(dx, dy)) {
      perimeter++;
      edges.push(index);
      return;
    }

    if (map[dx][dy] === symbol) {
      walk(symbol, dx, dy);
    } else if (map[dx][dy] !== visitedKey) {
      edges.push(index);
      perimeter++;
    }
  });

  if (edges.length === 3) {
    corners += 2;
  }

  if (edges.length === 2 && (edges[0] + edges[1]) % 2) {
    corners += 1;
  }

  DIRECTIONS.forEach((dir, i) => {
    const iplus1 = (i + 1) % 4;

    const dx = x + dir.x;
    const dy = y + dir.y;
    const d90x = x + DIRECTIONS[iplus1].x;
    const d90y = y + DIRECTIONS[iplus1].y;
    const cornerX = x + CORNERS[i].x;
    const cornerY = y + CORNERS[i].y;

    if (!isOutside(cornerX, cornerY)) {
      if (
        (map[dx][dy] === symbol || map[dx][dy] === visitedKey) &&
        (map[d90x][d90y] === symbol || map[d90x][d90y] === visitedKey)
      ) {
        if (
          map[cornerX]?.[cornerY] !== symbol &&
          map[cornerX]?.[cornerY] !== visitedKey
        ) {
          copy[x][y] = symbol.toLocaleLowerCase();
          corners += 1;
        }
      }
    }
  });
}

function findNext() {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (!map[i][j].startsWith(".")) return { x: i, y: j };
}

function part2(input: string) {
  const lines = input.split("\n");
  map = lines.map((line) => line.split(""));
  size = map.length;

  copy = JSON.parse(JSON.stringify(map));

  console.table(map);

  let total = 0;

  for (let corner; (corner = findNext()); ) {
    const { x, y } = corner;

    const symbol = map[x][y];
    area = 0;
    perimeter = 0;
    corners = 0;

    walk(symbol, x, y);

    if (area === 1) corners = 4;
    console.log(symbol, "A:", area, "P:", perimeter, "N:", corners);

    total += area * corners;
  }

  console.table(copy);
  console.log(total);
}

if (import.meta.main) {
  part2(readInput().trimEnd());
}
