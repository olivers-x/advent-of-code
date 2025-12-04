import { direct as convolution } from 'ml-matrix-convolution';
import { read, padWithZero } from '../lib.mjs';

const kernel = [
  [1, 1, 1],
  [1, 100, 1],
  [1, 1, 1],
];

function part1(input) {
  let grid = input
    .split('\n')
    .map((line) => line.split('').map((s) => (s === '@' ? 1 : 0)));

  grid = padWithZero(grid);

  const r = convolution(grid, kernel);
  const count = r.filter((c) => c < 104 && c > 10).length;

  console.log(count);
}

part1(read());
