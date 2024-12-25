import { read } from "../lib.mjs";

const locks = [];
const keys = [];

function pinHeights(schema, isLock) {
  const heights = Array(schema[0].length).fill(0);

  for (let i = 0; i < schema[0].length; i++) {
    if (isLock) {
      for (let j = schema.length - 1; j >= 0; j--) {
        if (schema[j][i] === "#") {
          heights[i] = j + 1;
          break;
        }
      }
    } else {
      for (let j = 0; j < schema.length; j++) {
        if (schema[j][i] === "#") {
          heights[i] = schema.length - j - 1;
          break;
        }
      }
    }
  }

  return heights;
}

function parseSchema(schema) {
  const lines = schema.split("\n");
  const isLock = lines[0] === "#####";

  if (isLock) locks.push(pinHeights(lines.slice(1), true));
  if (!isLock) keys.push(pinHeights(lines.slice(1), false));
}

function part1(input) {
  const schematics = input.split("\n\n");

  schematics.forEach(parseSchema);

  let nOverlaps = 0;

  for (let lock of locks) {
    for (let key of keys) {
      for (let i = 0; i < 6; i++) {
        if (lock[i] + key[i] > 5) {
          nOverlaps++;
          break;
        }
      }
    }
  }

  console.log("overlaps", nOverlaps);
  console.log("total", locks.length * keys.length - nOverlaps);
}

part1(read());
