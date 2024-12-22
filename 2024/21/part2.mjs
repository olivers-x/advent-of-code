import { read, sum } from "../lib.mjs";

const makeKey = (a, b) => a + b;

const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let key = makeKey(args[0], args[1]);
    if (key in cache) {
      return cache[key];
    } else {
      let result = fn(args[0], args[1]);
      cache[key] = result;
      return result;
    }
  };
};

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

  return ry + rx;
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

const charToPathArrows = memoize((char1, char2) => {
  if (char1 === "^" && char2 === "<") return "v<";
  if (char1 === "A" && char2 === "<") return "v<<";
  if (char1 === "<" && char2 === "^") return ">^";
  if (char1 === "<" && char2 === "A") return ">>^";

  return xyToPathDoor(ARROW_PAD[char1], ARROW_PAD[char2]);
});

function getDoorPadSequence(doorCode) {
  let sequence = "";
  let r = [];

  for (let i = 1; i < doorCode.length; i++) {
    const prev = doorCode[i - 1];
    const cur = doorCode[i];

    sequence += charToPathDoors(prev, cur) + "A";
    r.push(charToPathDoors(prev, cur) + "A");
  }

  return sequence;
}

const getArrowPadSequence = memoize((s) => {
  let sequence = "A" + s;
  let r = "";
  for (let i = 1; i < sequence.length; i++) {
    const prev = sequence[i - 1];
    const cur = sequence[i];

    r += charToPathArrows(prev, cur) + "A";
  }

  return r;
});

const DEPTH = 1 + 0;
// const DEPTH = 1 + 23;

function processLine(line) {
  let doorCode = ("A" + line).split("");

  let doorPadSequence = getDoorPadSequence(doorCode);
  let arrowPadSequence = getArrowPadSequence(doorPadSequence);
  console.log(arrowPadSequence);

  for (let i = 1; i <= DEPTH; i++) {
    console.log(line, " ", i);
    arrowPadSequence = getArrowPadSequence(arrowPadSequence);
  }

  const c1 = arrowPadSequence.length;
  const c2 = parseInt(line.substring(0, 3), 10) || 1;

  console.log(line + ":C: ", c1, c2);

  return c1 * c2;
}

function part2(input) {
  const lines = input.split("\n");

  const total = lines.map(processLine).reduce(sum, 0);
  console.log(total);
}

// part1 - 224326
// part2 too low 82816247134

part2(read());
