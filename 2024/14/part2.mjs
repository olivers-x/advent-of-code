import { read, toInt, sum } from "../lib.mjs";
import { multiply, add } from "mathjs";

const WIDE = 101;
const TALL = 103;

const SECONDS = process.argv[process.argv.length - 2];

function plotPoints(points) {
  const grid = Array.from({ length: TALL }, () => Array(WIDE).fill(" "));

  points.forEach(([x, y]) => {
    grid[x][y] = "X";
  });

  grid.forEach((line) => console.log(line.join("")));

  return grid;
}

const regex = /p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)/;

function parseLine(line) {
  const match = line.match(regex);
  const p = [match[2], match[1]].map(toInt);
  const v = [match[4], match[3]].map(toInt);

  return { p, v };
}

function second(lines, nSeconds) {
  return lines.map(({ p, v }) => {
    const r1 = multiply(v, nSeconds);
    const r2 = add(r1, p);

    let px = r2[0] % TALL;
    let py = r2[1] % WIDE;

    if (px < 0) px = TALL + px;
    if (py < 0) py = WIDE + py;

    if (px === -0) px = 0;
    if (py === -0) py = 0;

    return [px, py];
  });
}

function part2(input) {
  const lines = input.split("\n").map(parseLine);

  for (let i = 1; i <= SECONDS; i++) {
    const after = second(lines, i);
    const y32count = after.filter(([x, y]) => y === 32).length;

    if (y32count > 30) {
      console.log("points after ", i);
      plotPoints(after);
    }
  }
}

part2(read());
