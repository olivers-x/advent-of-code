import { readInput } from "./input.ts";

const toInt = (s: string) => parseInt(s, 10);

type Map = number[][];
type Position = { x: number; y: number };

let mapSize;
let map;

function toMap(input: string): Map {
  return input.split("\n").map((line) => line.split("").map(toInt));
}

function findTrailheads(map: Map) {
  const trailheads: Position[] = [];
  const size = map.length;
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (map[i][j] === 0) trailheads.push({ x: i, y: j });

  return trailheads;
}

let score = 0;
function startWalk(position: Position) {
  walk(position, 0);
}

function walk(position: Position, height: number) {
  const { x, y } = position;

  if (x < 0 || y < 0 || x >= mapSize || y >= mapSize) return;
  if (map[x][y] !== height) return;
  if (map[x][y] === 9) {
    score++;
    return;
  }

  walk({ x: x + 1, y }, height + 1);
  walk({ x, y: y + 1 }, height + 1);
  walk({ x: x - 1, y }, height + 1);
  walk({ x, y: y - 1 }, height + 1);
}

function part2(input: string) {
  map = toMap(input);
  mapSize = map.length;

  const trailheads = findTrailheads(map);
  trailheads.forEach(startWalk);

  console.log("score", score);
}

if (import.meta.main) {
  part2(readInput().trimEnd());
}
