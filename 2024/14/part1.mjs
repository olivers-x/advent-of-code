import { read, toInt, sum } from "../lib.mjs";
import { multiply, add } from "mathjs";

const WIDE = 101;
const TALL = 103;

const SECONDS = 100;

function plotPoints(points) {
  const grid = Array.from({ length: TALL }, () => Array(WIDE).fill(" "));

  points.forEach(([x, y]) => {
    grid[x][y] = "x";
  });

  console.table(grid);
}

const regex = /p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)/;

const midX = (TALL - 1) / 2;
const midY = (WIDE - 1) / 2;

function parseLine(line) {
  const match = line.match(regex);
  const p = [match[2], match[1]].map(toInt);
  const v = [match[4], match[3]].map(toInt);

  return { p, v };
}

function isNotMiddle([x, y]) {
  return x !== midX && y !== midY;
}

function toQuadrant([x, y]) {
  if (x < midX && y < midY) return 1;
  if (x < midX && y > midY) return 2;
  if (x > midX && y < midY) return 3;
  if (x > midX && y > midY) return 4;

  return 5;
}

function part1(input) {
  const lines = input.split("\n").map(parseLine);

  console.table(lines);
  const starts = lines.map(({ p }) => p);
  plotPoints(starts);

  const afterSeconds = lines
    .map(({ p, v }) => {
      const r1 = multiply(v, SECONDS);
      const r2 = add(r1, p);

      let px = r2[0] % TALL;
      let py = r2[1] % WIDE;

      if (px < 0) px = TALL + px;
      if (py < 0) py = WIDE + py;

      if (px === -0) px = 0;
      if (py === -0) py = 0;

      return [px, py];
    })
    .filter(isNotMiddle);

  console.log("points after ", SECONDS);
  plotPoints(afterSeconds);
  console.table(afterSeconds);

  const asQuadrants = afterSeconds.map(toQuadrant);
  console.table(asQuadrants);

  const r = Object.values(afterSeconds.group(toQuadrant));
  const total = r.map((points) => points.length).reduce((a, b) => a * b);

  console.log(total);
}

part1(read());
