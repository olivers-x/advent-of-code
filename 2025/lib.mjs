import { readFileSync } from 'fs';

export const identity = (a) => a;

export const sum = (a, b) => a + b;

export const toInt = (s) => parseInt(s, 10);

export const isNumber = (n) => n !== undefined && n !== ' ' && !Number.isNaN(n);

export function unique(value, index, array) {
  return array.indexOf(value) === index;
}

export function read() {
  const fileName = process.argv[process.argv.length - 1];
  return readFileSync(fileName, { encoding: 'utf-8', flag: 'r' }).trimEnd();
}

Array.prototype.group = function (callback) {
  return this.reduce((acc = {}, ...args) => {
    const key = callback(...args);
    acc[key] ??= [];
    acc[key].push(args[0]);
    return acc;
  }, {});
};

export function padWithZero(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const padded = Array(rows + 2)
    .fill(0)
    .map(() => Array(cols + 2).fill(0));

  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      padded[i + 1][j + 1] = grid[i][j];
    }

  return padded;
}
