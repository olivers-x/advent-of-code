import { read } from "../lib.mjs";

let width;
let height;
let map;

let px, py;

function printMap() {
  map.forEach((line) => console.log(line.join("")));
}

const DIRECTIONS = {
  "^": { x: -1, y: 0 },
  v: { x: 1, y: 0 },
  ">": { x: 0, y: 1 },
  "<": { x: 0, y: -1 },
};

function prepareMap(mapAsString) {
  map = mapAsString.split("\n").map((line) => line.split(""));

  let x, y;
  height = map.length;
  width = map[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === "@") {
        map[i][j] = ".";
        x = i;
        y = j;
        return [x, y];
      }
    }
  }
}

function getFirstEmptyOr(d) {
  for (let i = 2; ; i++) {
    const nx = px + i * d.x;
    const ny = py + i * d.y;
    const symbol = map[nx][ny];

    if (symbol === ".") {
      return [nx, ny];
    }

    if (symbol === "#") return;
  }
}

function walk(instruction) {
  const d = DIRECTIONS[instruction];
  if (!d) return;

  const nx = px + d.x;
  const ny = py + d.y;
  const symbol = map[nx][ny];

  if (symbol === "#") return;

  if (symbol === ".") {
    px = nx;
    py = ny;
    return;
  }

  if (symbol === "O") {
    const empty = getFirstEmptyOr(d);

    if (!empty) return;

    map[nx][ny] = ".";
    map[empty[0]][empty[1]] = "O";

    px = nx;
    py = ny;
  }
}

function calculateSum() {
  let sum = 0;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === "O") {
        sum += 100 * i + j;
      }
    }
  }

  return sum;
}

function part1(input) {
  console.log(input);

  const [mapAsString, instructions] = input.split("\n\n");
  const start = prepareMap(mapAsString);

  printMap();
  console.log("start @ ", start);

  [px, py] = start;

  instructions
    .trimEnd()
    .split("")
    .forEach((instruction) => {
      walk(instruction);
    });

  map[px][py] = "@";
  printMap();

  console.log("end @ ", [px, py]);

  console.log(calculateSum());
}

part1(read());
