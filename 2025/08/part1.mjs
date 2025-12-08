import { read } from '../lib.mjs';
import { Graph } from './Graph.mjs';

const asc = (p1, p2) => p1.d - p2.d;

const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

const closest = (points) => {
  const allPairs = points.flatMap((p1, i) =>
    points.slice(i + 1).map((p2) => ({
      p1,
      p2,
      d: distance(p1, p2),
    }))
  );

  return allPairs.sort(asc);
};

const N = 1000;

function part1(input) {
  const points = input.split('\n').map((line) => {
    const [x, y, z] = line.split(',').map(Number);
    return { x, y, z };
  });

  const pairs = closest(points);
  const graph = new Graph();

  for (let i = 0; i < N; i++) {
    graph.addPair(pairs[i]);
  }

  const clusters = graph.findClusters().sort((a, b) => b.length - a.length);
  const [a, b, c] = clusters;
  console.log(a.length * b.length * c.length);
}

part1(read());
