import { read, sum } from '../lib.mjs';

function part1(input) {
  const grid = input.split('\n').map((line) => line.split(''));
  const grid2 = input.split('\n').map((line) => line.split(''));

  const rows = grid.length;
  const columns = grid[0].length;

  let count = 0;

  const check = (x, y) => {
    if (x < 0) return false;
    if (y < 0) return false;
    if (x === rows) return false;
    if (y === columns) return false;
    return grid[x][y] === '@';
  };

  for (let i = 0; i < rows; i++)
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] !== '@') continue;
      const adj = [
        check(i - 1, j - 1),
        check(i, j - 1),
        check(i + 1, j - 1),
        check(i - 1, j),
        check(i + 1, j),
        check(i - 1, j + 1),
        check(i, j + 1),
        check(i + 1, j + 1),
      ]
        .map(Number)
        .reduce(sum);

      if (adj < 4) {
        count++;
        grid2[i][j] = 'x';
      }
    }

  console.log(count);
}

part1(read());
