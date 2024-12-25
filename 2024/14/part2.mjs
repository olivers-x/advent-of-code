import { read, toInt, sum, unique } from "../lib.mjs";
import { multiply, add } from "mathjs";
import { direct as convolution } from "ml-matrix-convolution";

const WIDE = 101;
const TALL = 103;

const gt1 = (i) => i > 1;

function plotPoints(points) {
  const grid = Array.from({ length: TALL }, () => Array(WIDE).fill(0));

  points.forEach(([x, y]) => {
    grid[x][y] = 1;
  });

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

const DIAGONAL = [
  [-2, -1, -1, 1],
  [-1, -1, 1, -1],
  [-1, 1, -1, -1],
  [1, -1, -1, -2],
];

function part2(input) {
  const lines = input.split("\n").map(parseLine);

  for (let i = 1; ; i++) {
    const points = second(lines, i);
    const matrix = plotPoints(points);

    const y32count = points
      .filter(([, y]) => y === 32)
      .map(([x]) => x)
      .filter(unique).length;

    if (y32count > 30) {
      const hasDiagonal = convolution(matrix, DIAGONAL)
        .filter(gt1)
        .every((i) => i === 2);

      if (hasDiagonal) {
        matrix.forEach((line) => console.log(line.join("")));
        return;
      }
    }
  }
}

part2(read());
