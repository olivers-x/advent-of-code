import { read, sum } from "../lib.mjs";

const DOOR_PAD = {
  0: { x: 3, y: 1 },
  A: { x: 3, y: 2 },
  1: { x: 2, y: 0 },
  2: { x: 2, y: 1 },
  3: { x: 2, y: 2 },
  4: { x: 1, y: 0 },
  5: { x: 1, y: 1 },
  6: { x: 1, y: 2 },
  7: { x: 0, y: 0 },
  8: { x: 0, y: 1 },
  9: { x: 0, y: 2 },
};

const ARROW_PAD = {
  "^": { x: 0, y: 1 },
  A: { x: 0, y: 2 },
  "<": { x: 1, y: 0 },
  v: { x: 1, y: 1 },
  ">": { x: 1, y: 2 },
};

function xyToPathDoor(p1, p2) {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;

  const ySymbol = y1 < y2 ? ">" : "<";
  const xSymbol = x1 < x2 ? "v" : "^";

  const rx = xSymbol.repeat(Math.abs(x1 - x2));
  const ry = ySymbol.repeat(Math.abs(y1 - y2));

  if (ySymbol === "<") {
    return ry + rx;
  }

  if (xSymbol === "v") {
    return rx + ry;
  }

  const r = ry + rx;

  return r;
}

function charToPathDoors(char1, char2) {
  if (char1 === "7" && char2 === "0") return ">vvv";
  if (char1 === "4" && char2 === "0") return ">vv";
  if (char1 === "1" && char2 === "0") return ">v";
  if (char1 === "7" && char2 === "A") return ">>vvv";
  if (char1 === "4" && char2 === "A") return ">>vv";
  if (char1 === "1" && char2 === "A") return ">>v";
  if (char1 === "0" && char2 === "1") return "^<";
  if (char1 === "0" && char2 === "4") return "^^<";
  if (char1 === "0" && char2 === "7") return "^^^<";
  if (char1 === "A" && char2 === "1") return "^<<";
  if (char1 === "A" && char2 === "4") return "^^<<";
  if (char1 === "A" && char2 === "7") return "^^^<<";

  return xyToPathDoor(DOOR_PAD[char1], DOOR_PAD[char2]);
}

function charToPathArrows(char1, char2) {
  if (char1 === "^" && char2 === "<") return "v<";
  if (char1 === "A" && char2 === "<") return "v<<";
  if (char1 === "<" && char2 === "^") return ">^";
  if (char1 === "<" && char2 === "A") return ">>^";

  return xyToPathDoor(ARROW_PAD[char1], ARROW_PAD[char2]);
}

function getDoorPadSequence(doorCode) {
  let sequence = "";

  for (let i = 1; i < doorCode.length; i++) {
    const prev = doorCode[i - 1];
    const cur = doorCode[i];

    sequence += charToPathDoors(prev, cur) + "A";
  }

  return sequence;
}

function getArrowPadSequence(line) {
  let doorCode = ("A" + line).split("");

  let sequence = "";

  for (let i = 1; i < doorCode.length; i++) {
    const prev = doorCode[i - 1];
    const cur = doorCode[i];

    sequence += charToPathArrows(prev, cur) + "A";
  }

  return sequence;
}

function processLine(line) {
  let doorCode = ("A" + line).split("");

  const doorPadSequence = getDoorPadSequence(doorCode);

  console.log(line + ":DP: " + doorPadSequence);

  const arrowPadSequence1 = getArrowPadSequence(doorPadSequence);

  console.log(line + ":A1: " + arrowPadSequence1);

  const arrowPadSequence2 = getArrowPadSequence(arrowPadSequence1);

  console.log(line + ":A2: " + arrowPadSequence2);
  const c1 = arrowPadSequence2.length;
  const c2 = parseInt(line.substring(0, 3), 10) || 1;

  console.log(line + ":C: ", c1, c2);

  return c1 * c2;
}

function part1(input) {
  const lines = input.split("\n");

  console.assert(processLine("A2") === 22, "A2");
  console.assert(processLine("2A") === 38 * 2, "2A");
  console.assert(processLine("029A") === 1972, "029A");
  console.assert(processLine("980A") === 58800, "980A");
  console.assert(processLine("179A") === 12172, "179A");
  console.assert(processLine("456A") === 64 * 456, "456A");
  console.assert(processLine("379A") === 64 * 379, "379A");

  const total = lines.map(processLine).reduce(sum, 0);
  console.log(total);
}

// part1 too high 227898

part1(read());
