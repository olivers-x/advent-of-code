import { read } from '../lib.mjs';

let root = null;
const graph = {}; // { [node: string] : string[] }

function allPathsToOut(start) {
  const results = [];

  function dfs(node, path) {
    const next = graph[node] || [];
    for (const nxt of next) {
      if (nxt === 'out') {
        results.push([...path, node, 'out']);
      } else {
        dfs(nxt, [...path, node]);
      }
    }
  }

  dfs(start, []);
  return results;
}

function part1(input) {
  const x = input.split('\n').map((line) => line.split(': '));
  for (let [node, children] of x) {
    children = children.split(' ');
    console.log(node);
    console.log(children);
    graph[node] = children;

    if (node === 'you') root = node;
  }

  const result = allPathsToOut(root);
  console.table(result);
  console.log(result.length);
}

part1(read());
