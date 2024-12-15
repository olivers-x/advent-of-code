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

function insertToMap(x, y, s1, s2) {
  map[x][y * 2] = s1;
  map[x][y * 2 + 1] = s2;
}

function prepareMap(mapAsString) {
  const inputMap = mapAsString.split("\n").map((line) => line.split(""));

  let x, y;
  height = inputMap.length;
  width = inputMap[0].length;

  map = Array.from({ length: height }, () => Array(width * 2).fill("."));

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (inputMap[i][j] === "@") {
        insertToMap(i, j, ".", ".");
        x = i;
        y = j * 2;
      }

      if (inputMap[i][j] === "#") {
        insertToMap(i, j, "#", "#");
      }

      if (inputMap[i][j] === "O") {
        insertToMap(i, j, "[", "]");
      }
    }
  }

  width *= 2;
  return [x, y];
}

function getFirstEmptyOr(d) {
  for (let i = 2; ; i++) {
    const nx = px + i * d.x;
    const ny = py + i * d.y;
    const symbol = map[nx][ny];

    if (symbol === ".") {
      return ny;
    }

    if (symbol === "#") return;
  }
}

function flipBetween(x, y1, y2) {
  const k = y1 > y2 ? -1 : 1;
  console.log("flip between", ...arguments);

  for (let yy = y1; yy !== y2; yy += k) {
    map[x][yy] = map[x][yy] === "]" ? "[" : "]";
  }
}

function canMoveBlock(toX, toY, d) {
  const x = toX + d.x;
  const y = toY;

  const symbol = map[x][y];

  if (symbol === ".") return true;
  if (symbol === "#") return false;
  if (symbol === "[") return canMoveBlock(x, y, d) && canMoveBlock(x, y + 1, d);
  if (symbol === "]") return canMoveBlock(x, y, d) && canMoveBlock(x, y - 1, d);
}

function moveBlock(toX, toY, d, toInsert) {
  const x = toX + d.x;
  const y = toY;

  const symbol = map[x][y];

  if (symbol === ".") map[x][y] = toInsert;

  if (symbol === "#") throw new Error("Trying to move block into #");

  if (symbol === "[") {
    moveBlock(x, y, d, "[");
    moveBlock(x, y + 1, d, "]");

    map[x][y + 1] = ".";
    map[x][y] = toInsert;
  }

  if (symbol === "]") {
    moveBlock(x, y, d, "]");
    moveBlock(x, y - 1, d, "[");

    map[x][y - 1] = ".";
    map[x][y] = toInsert;
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

  if (symbol === "[" || symbol === "]") {
    const isLeft = symbol === "[";

    // left <-> right
    if (d.x === 0) {
      console.log("moving left and right");
      const emptyY = getFirstEmptyOr(d);
      if (!emptyY) return;

      flipBetween(nx, ny, emptyY);

      map[nx][emptyY] = isLeft ? "]" : "[";
      map[nx][ny] = ".";
      px = nx;
      py = ny;

      return;
    }

    const k = isLeft ? 1 : -1; // [

    // up <-> down
    if (canMoveBlock(nx, ny, d) && canMoveBlock(nx, ny + k, d)) {
      console.log("moving up <-> down possible, []");

      if (isLeft) {
        moveBlock(nx, ny, d, "[");
        moveBlock(nx, ny + 1, d, "]");
      } else {
        moveBlock(nx, ny, d, "]");
        moveBlock(nx, ny - 1, d, "[");
      }

      map[nx][ny] = ".";
      map[nx][ny + k] = ".";

      px = nx;
      py = ny;
    }
  }
}

function calculateSum() {
  let sum = 0;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (map[i][j] === "[") {
        sum += 100 * i + j;
      }
    }
  }

  return sum;
}

function part2(input) {
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
      console.log("@ ", [px, py], instruction);
    });

  map[px][py] = "@";
  printMap();

  console.log("end @ ", [px, py]);

  console.log(calculateSum());
}

part2(read());
