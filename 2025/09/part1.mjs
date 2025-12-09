import { read } from '../lib.mjs';

const area = (x1, y1, x2, y2) =>
  (Math.abs(x1 - x2) + 1) * (1 + Math.abs(y1 - y2));

function part1(input) {
  const points = input.split('\n').map((line) => line.split(',').map(Number));

  console.table(points);

  const pairs = points.flatMap((p1, i) =>
    points.slice(i + 1).map((p2) => ({
      p1,
      p2,
      a: area(p1[0], p1[1], p2[0], p2[1]),
    }))
  );

  const [first] = pairs.sort((a, b) => b.a - a.a);
  console.log(first);
}

part1(read());
