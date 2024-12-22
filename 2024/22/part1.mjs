import { read, sum } from "../lib.mjs";

function process(n) {
  let r1 = ((n << 6) ^ n) & 16777215;
  let r2 = ((r1 >> 5) ^ r1) & 16777215;
  let r3 = ((r2 << 11) ^ r2) & 16777215;

  return r3;
}

function part1(input) {
  const lines = input.split("\n").map(Number);

  const total = lines
    .map((n) => {
      let r = n;
      for (let i = 0; i < 2000; i++) {
        r = process(r);
      }

      return r;
    })
    .reduce(sum);

  console.log(total);
}

part1(read());
