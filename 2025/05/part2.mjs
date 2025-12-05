import { read, sum } from '../lib.mjs';

function part2(input) {
  const [ranges] = input.split('\n\n');

  const checks = ranges
    .split('\n')
    .map((range) => {
      const [min, max] = range.split('-').map(Number);
      return { min, max };
    })
    .sort((a, b) => a.min - b.min);

  const merged = [checks[0]];

  for (let current of checks) {
    const lastMerged = merged[merged.length - 1];

    if (current.min <= lastMerged.max) {
      lastMerged.max = Math.max(lastMerged.max, current.max);
    } else {
      merged.push(current);
    }
  }

  console.log(merged);

  const result = merged.map(({ min, max }) => 1 + max - min).reduce(sum);
  console.log(result);
}

part2(read());
