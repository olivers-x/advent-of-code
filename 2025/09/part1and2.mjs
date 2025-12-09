import PolyBool from 'polybooljs';
import { read } from '../lib.mjs';

const area = (x1, y1, x2, y2) =>
  (Math.abs(x1 - x2) + 1) * (1 + Math.abs(y1 - y2));

const getRect = (p1, p2) => {
  const minX = Math.min(p1[0], p2[0]);
  const maxX = Math.max(p1[0], p2[0]);
  const minY = Math.min(p1[1], p2[1]);
  const maxY = Math.max(p1[1], p2[1]);

  return {
    regions: [
      [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
      ],
    ],
    inverted: false,
  };
};

function solve(input) {
  const points = input.split('\n').map((line) => line.split(',').map(Number));

  const pairs = points.flatMap((p1, i) =>
    points.slice(i + 1).map((p2) => ({
      p1,
      p2,
      a: area(p1[0], p1[1], p2[0], p2[1]),
    }))
  );

  const [first] = pairs.sort((a, b) => b.a - a.a);
  console.log('Part 1:', first.a);

  const polygon = {
    regions: [points],
    inverted: false,
  };

  const l = pairs.length;

  pairs.forEach((p, i) => {
    const d = PolyBool.difference(getRect(p.p1, p.p2), polygon).regions.length;
    if (i % 580 === 0) console.log(Math.floor(l / i), '%');

    if (d === 0) {
      console.log('Part 2:', p.a);
      process.exit(0);
    }
  });
}

solve(read());
