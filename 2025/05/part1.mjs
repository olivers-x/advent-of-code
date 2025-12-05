import { read, sum } from '../lib.mjs';

function part1(input) {
  const [ranges, ids] = input.split('\n\n');

  const checks = ranges.split('\n').map((range) => {
    const [min, max] = range.split('-').map(Number);
    return (n) => n >= min && n <= max;
  });

  const results = ids
    .split('\n')
    .map(Number)
    .map((n) => {
      for (let check of checks) {
        if (check(n)) return 1;
      }
      return 0;
    });

  console.log(results.reduce(sum));
}

part1(read());
