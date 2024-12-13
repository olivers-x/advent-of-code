const fs = require("fs");

function readLine(filePath) {
  return fs.readFileSync(filePath, { encoding: "utf-8", flag: "r" });
}

const sum = (a, b) => a + b;

function makeKey(a, b) {
  return (a << 7) + b;
}

let cacheHit = 0;
let cacheMiss = 0;

const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let key = makeKey(args[0], args[1]);
    if (key in cache) {
      cacheHit++;
      return cache[key];
    } else {
      cacheMiss++;
      let result = fn(args[0], args[1]);
      cache[key] = result;
      return result;
    }
  };
};

const toInt = (s) => parseInt(s, 10);

const N_BLINKS = 75;

const blink = memoize((stone, deepness = 0) => {
  if (deepness >= N_BLINKS) {
    return 1;
  }

  if (stone === 0) {
    return blink(1, deepness + 1);
  }

  const asString = stone.toString();
  const nDigits = asString.length;
  if (nDigits % 2 === 0) {
    const half = nDigits / 2;

    const a = toInt(asString.slice(0, half));
    const b = toInt(asString.slice(half));

    return blink(a, deepness + 1) + blink(b, deepness + 1);
  } else {
    return blink(stone * 2024, deepness + 1);
  }
});

function part1(input) {
  const stones = input.split(" ").map(toInt);

  const counts = stones.map((s, i) => {
    console.log("computing stone #", i);
    const nStones = blink(s, 0);

    return nStones;
  });

  const total = counts.reduce(sum, 0);

  console.log("cache hits", cacheHit);
  console.log("cache miss", cacheMiss);
  console.log("blinks", N_BLINKS, "n of stones", total);
}

const fileName = process.argv[process.argv.length - 1];
part1(readLine(fileName).trimEnd());
