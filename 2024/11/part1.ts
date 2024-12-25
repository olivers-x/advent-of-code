import { readInput } from "./input.ts";

const toInt = (s: string) => parseInt(s, 10);

const sum = (a: number, b: number) => a + b;

function blink(stones: number[]) {
  const after: number[] = [];

  for (let stone of stones) {
    if (stone === 0) {
      after.push(1);
      continue;
    }

    const asString = stone.toString();
    const nDigits = asString.length;
    if (nDigits % 2 === 0) {
      const half = nDigits / 2;
      after.push(toInt(asString.slice(0, half)));
      after.push(toInt(asString.slice(half)));
      continue;
    }

    after.push(stone * 2024);
  }

  return after;
}

function part1(input: string) {
  const stones = input.split(" ").map(toInt);
  const nBlinks = 25;

  let state = stones;
  for (let i = 0; i < nBlinks; i++) {
    state = blink(state);
  }

  console.log("n of stones", state.length);
}

if (import.meta.main) {
  part1(readInput().trimEnd());
}
