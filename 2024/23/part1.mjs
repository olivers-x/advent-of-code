import { read } from "../lib.mjs";

const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541,
];

function letterToPrime(letter) {
  return PRIMES[letter.charCodeAt(0) - 97];
}

const connections = [];

function addToSet(a, b) {
  const set = connections.find((group) => group.has(a));

  if (!set) {
    connections.push(new Set([a, b]));
    return;
  }

  set.add(b);
}

function addConnection(a, b) {
  const hasA = connections.find((group) => group.has(a));
  const hasB = connections.find((group) => group.has(b));

  if (hasA === hasB) {
    console.log("same group", a, b);
  }

  addToSet(a, b);
  addToSet(b, a);
}

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
    addConnection(a, b);
    addNode(a, b);
    addNode(b, a);
  }

  console.log(nodes);
  //   console.log(connections);

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

  console.log(triplets);
  //   const groupsWithT = nodes
  //     .map((node) => [node.id, ...node.connections])
  //     .map((connections) => connections.filter((id) => id.startsWith("t")).length)
  //     .filter(Boolean);

  //   console.log(connections.length);
}

part1(read());
