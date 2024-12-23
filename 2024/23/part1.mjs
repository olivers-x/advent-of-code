import { read } from "../lib.mjs";

const nodes = new Map();
function addNode(id, connectedTo) {
  if (nodes.has(id)) {
    nodes.get(id).add(connectedTo);
    return;
  }

  nodes.set(id, new Set([connectedTo]));
}

function part1(input) {
  const lines = input.trimEnd().split("\n");

  for (let line of lines) {
    let [a, b] = line.split("-");

    addNode(a, b);
    addNode(b, a);
  }

  const triplets = new Set();

  for (let [c, set] of nodes) {
    if (!c.startsWith("t")) {
      continue;
    }

    set.forEach((a) => {
      set.forEach((b) => {
        if (a === b) {
          return;
        }

        const setA = nodes.get(a);

        if (setA.has(b)) {
          const key = [a, b, c].sort().join("-");
          console.log("found", key);
          triplets.add(key);
        }
      });
    });
  }
}

part1(read());
