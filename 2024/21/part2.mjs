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

const FROM_TO = {
  A0: "<A",
  "0A": ">A",
  A1: "^<<A",
  "1A": ">>vA",
  A2: "<^A",
  "2A": "v>A",
  A3: "^A",
  "3A": "vA",
  A4: "^^<<A",
  "4A": ">>vvA",
  A5: "<^^A",
  "5A": "vv>A",
  A6: "^^A",
  "6A": "vvA",
  A7: "^^^<<A",
  "7A": ">>vvvA",
  A8: "<^^^A",
  "8A": "vvv>A",
  A9: "^^^A",
  "9A": "vvvA",
  "01": "^<A",
  10: ">vA",
  "02": "^A",
  20: "vA",
  "03": "^>A",
  30: "<vA",
  "04": "^<^A",
  40: ">vvA",
  "05": "^^A",
  50: "vvA",
  "06": "^^>A",
  60: "<vvA",
  "07": "^^^<A",
  70: ">vvvA",
  "08": "^^^A",
  80: "vvvA",
  "09": "^^^>A",
  90: "<vvvA",
  12: ">A",
  21: "<A",
  13: ">>A",
  31: "<<A",
  14: "^A",
  41: "vA",
  15: "^>A",
  51: "<vA",
  16: "^>>A",
  61: "<<vA",
  17: "^^A",
  71: "vvA",
  18: "^^>A",
  81: "<vvA",
  19: "^^>>A",
  91: "<<vvA",
  23: ">A",
  32: "<A",
  24: "<^A",
  42: "v>A",
  25: "^A",
  52: "vA",
  26: "^>A",
  62: "<vA",
  27: "<^^A",
  72: "vv>A",
  28: "^^A",
  82: "vvA",
  29: "^^>A",
  92: "<vvA",
  34: "<<^A",
  43: "v>>A",
  35: "<^A",
  53: "v>A",
  36: "^A",
  63: "vA",
  37: "<<^^A",
  73: "vv>>A",
  38: "<^^A",
  83: "vv>A",
  39: "^^A",
  93: "vvA",
  45: ">A",
  54: "<A",
  46: ">>A",
  64: "<<A",
  47: "^A",
  74: "vA",
  48: "^>A",
  84: "<vA",
  49: "^>>A",
  94: "<<vA",
  56: ">A",
  65: "<A",
  57: "<^A",
  75: "v>A",
  58: "^A",
  85: "vA",
  59: "^>A",
  95: "<vA",
  67: "<<^A",
  76: "v>>A",
  68: "<^A",
  86: "v>A",
  69: "^A",
  96: "vA",
  78: ">A",
  87: "<A",
  79: ">>A",
  97: "<<A",
  89: ">A",
  98: "<A",
  "<^": ">^A",
  "^<": "v<A",
  "<v": ">A",
  "v<": "<A",
  "<>": ">>A",
  "><": "<<A",
  "<A": ">>^A",
  "A<": "v<<A",
  "^v": "vA",
  "v^": "^A",
  "^>": "v>A",
  ">^": "<^A",
  "^A": ">A",
  "A^": "<A",
  "v>": ">A",
  ">v": "<A",
  vA: "^>A",
  Av: "<vA",
  ">A": "^A",
  "A>": "vA",
};

const getSequenceComplexity = memoize((s, depth) => {
  let l = 0;
  if (depth === 0) {
    return s.length;
  }

  let sequence = "A" + s;
  for (let i = 1; i < sequence.length; i++) {
    const prev = sequence[i - 1];
    const cur = sequence[i];

    if (cur === prev) {
      l += 1;
      continue;
    }

    const path = FROM_TO[makeKey(prev, cur)];

    l += getSequenceComplexity(path, depth - 1);
  }

  return l;
});

const DEPTH = 25; // directional keypads that robots are using.
// const DEPTH = 2; // directional keypads that robots are using.

function processLine(line) {
  const c1 = getSequenceComplexity(line, DEPTH + 1);
  const c2 = parseInt(line.substring(0, 3), 10) || 1;

  console.log(line + ":C: ", c1);

  return c1 * c2;
}

function part2(input) {
  const lines = input.split("\n");

  const total = lines.map(processLine).reduce(sum, 0);
  console.log(total);
}

// part1 - 224326
// part2 too low       82816247134
// part2 too high  319566753494332
// part2 not right 282839434152296
// part2  o        279638326612610

part2(read());
