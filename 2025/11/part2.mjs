import { read, memoize } from '../lib.mjs';

const graph = {}; // { [node: string] : string[] }

function allPathsToOut(start, end) {
  const dfs = memoize((node, count) => {
    const next = graph[node] || [];

    let c = 0;

    for (const nxt of next) {
      if (nxt === 'out' && end !== 'out') return 0;
      if (nxt === end) return 1;
      c += dfs(nxt, count);
    }

    return c;
  });

  return dfs(start, 0);
}

let svr;
let fft;
let dac;

function part1(input) {
  const x = input.split('\n').map((line) => line.split(': '));
  for (let [node, children] of x) {
    children = children.split(' ');
    graph[node] = children;

    if (node === 'svr') svr = node;
    if (node === 'fft') fft = node;
    if (node === 'dac') dac = node;
  }

  // svr -> fft -> dac -> out
  const A = allPathsToOut(svr, 'fft');
  const B = allPathsToOut(fft, 'dac');
  const C = allPathsToOut(dac, 'out');

  console.log(A * B * C);

  // svr -> dac -> fft -> out
  const X = allPathsToOut(svr, 'dac');
  const Y = allPathsToOut(fft, 'fft');
  const Z = allPathsToOut(dac, 'out');

  console.log(X * Y * Z);

  console.log('total:', A * B * C + X * Y * Z);
}

part1(read());
