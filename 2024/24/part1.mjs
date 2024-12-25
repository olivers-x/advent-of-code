import { read } from "../lib.mjs";

const wireMap = new Map();

function populateWireMap(wire) {
  const [name, value] = wire.split(": ");
  wireMap.set(name, Boolean(Number(value)));
}

function OR(a, b) {
  return a || b;
}

function AND(a, b) {
  return a && b;
}

function XOR(a, b) {
  return a !== b;
}

function part1(input) {
  let [wires, gates] = input.trimEnd().split("\n\n");
  wires = wires.split("\n");
  gates = gates.split("\n");

  wires.forEach(populateWireMap);

  const queue = [];

  for (let gate of gates) {
    const [a, operator, b, , c] = gate.split(" ");
    console.log(a, operator, b, "->", c);
    queue.push([a, operator, b, c]);
  }

  while (queue.length) {
    const [a, operator, b, c] = queue.shift();
    console.log(a, operator, b, c);

    if (wireMap.has(a) && wireMap.has(b)) {
      const value =
        operator === "AND"
          ? AND(wireMap.get(a), wireMap.get(b))
          : operator === "OR"
          ? OR(wireMap.get(a), wireMap.get(b))
          : operator === "XOR"
          ? XOR(wireMap.get(a), wireMap.get(b))
          : wireMap.get(a);

      wireMap.set(c, value);
    } else {
      queue.push([a, operator, b, c]);
    }
  }

  console.log(wireMap);

  wireMap.forEach((_, key) => {
    if (!key.startsWith("z")) {
      wireMap.delete(key);
    }
  });

  console.log(wireMap);
  let result = Array.from(wireMap.keys());

  result = result.map((key) => key.substring(1)).sort((a, b) => b - a);
  result = result.map((key) => (wireMap.get("z" + key) ? "1" : "0"));

  console.log(parseInt(result.join(""), 2));
}

part1(read());
