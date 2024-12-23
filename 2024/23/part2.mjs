import { read } from "../lib.mjs";
import { analyzeGraphFast } from "graph-cycles";

function nodesToGraph(nodes) {
  const graph = [];
  for (let [node, connectedTo] of nodes) {
    graph.push([node, Array.from(connectedTo)]);
  }

  return graph;
}

function connectionsToNodes(connections) {
  const nodes = new Map();

  function addNode(id, connectedTo) {
    if (nodes.has(id)) {
      nodes.get(id).add(connectedTo);
      return;
    }

    nodes.set(id, new Set([connectedTo]));
  }

  connections.forEach(([a, b]) => {
    addNode(a, b);
    addNode(b, a);
  });

  return nodes;
}

function findSingleClique(nodes, start) {
  const clique = new Set();
  const vertices = new Set(nodes.keys());
  let isNext = false;

  clique.add(start);

  for (let vertex of vertices) {
    if (clique.has(vertex)) {
      continue;
    }
    isNext = true;

    for (let u of clique) {
      if (nodes.get(u).has(vertex)) {
        continue;
      } else {
        isNext = false;
        break;
      }
    }

    if (isNext) {
      clique.add(vertex);
    }
  }

  return clique;
}

function part2(input) {
  const lines = input.trimEnd().split("\n");
  const connections = lines.map((line) => line.split("-"));

  const nodes = connectionsToNodes(connections);
  const graph = nodesToGraph(nodes);
  const { cyclic } = analyzeGraphFast(graph);

  const largest = cyclic
    .map((start) => findSingleClique(nodes, start))
    .sort((a, b) => b.size - a.size)[0];

  console.log(Array.from(largest).sort().join(","));
}

part2(read());
