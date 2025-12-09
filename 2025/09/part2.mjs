import { read } from '../lib.mjs';
import PolyBool from 'polybooljs';

const area = (p1, p2) =>
  (Math.abs(p1[0] - p2[0]) + 1) * (1 + Math.abs(p1[1] - p2[1]));

const getRect = (p1, p2) => {
  const minX = Math.min(p1[0], p2[0]);
  const maxX = Math.max(p1[0], p2[0]);
  const minY = Math.min(p1[1], p2[1]);
  const maxY = Math.max(p1[1], p2[1]);

  const rect = {
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

  return rect;
};

function part2(input) {
  let points = input.split('\n').map((line) => line.split(',').map(Number));

  // Two lines
  // start: 1,656, 50,072
  // end: 94,821, 50,072

  // start: 94,821, 48,704
  // end: 1,947, 48,704

  const MIDDLE = 47_000;

  const LINE_1 = 50_072;
  const LINE_2 = 48_704;

  const P1 = [94_821, 48_704];
  const P2 = [94_821, 50_072];

  // const firstHalf = points.filter((p) => p[1] <= LINE_2);
  const secondHalf = points.filter((p) => p[1] >= LINE_1);

  // const Q1 = firstHalf.filter((p) => p[0] < MIDDLE);
  // const Q2 = firstHalf.filter((p) => p[0] >= MIDDLE);
  // const Q3 = secondHalf.filter((p) => p[0] > MIDDLE);
  const Q4 = secondHalf.filter((p) => p[0] <= MIDDLE);

  // Area must start either at
  // 94_821, 50_072  with point from Q4
  // 94_821, 48_704 with point from Q1

  const polygon = {
    regions: [secondHalf],
    inverted: false,
  };

  Q4.map((p1) => ({
    p1,
    a: area(p1, P2),
  }))
    .sort((a, b) => b.a - a.a)
    .forEach((p) => {
      const d = PolyBool.difference(getRect(p.p1, P2), polygon).regions.length;
      if (d === 0) {
        console.log(p.a);
        process.exit(0);
      }
    });
}

// 4781377701 - too high
// 4777440153 - too high
// 2861661733 - too high
// 2839502973 - no
// 1470616992 -- correct

part2(read());
