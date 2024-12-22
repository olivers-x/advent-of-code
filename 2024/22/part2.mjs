import { read, sum } from "../lib.mjs";

// 10 -> 0b1010
// const key = (a, b, c, d) => a + b * 16 + c * 256 + d * 4096;
const key = (a, b, c, d) => a + "," + b + "," + c + "," + d;
// const key = (a, b, c, d) => a + b * 16 + c * 256 + d * 4096;

function process(n) {
  let r1 = ((n << 6) ^ n) & 16777215;
  let r2 = (r1 >> 5) ^ r1; // & 16777215;
  let r3 = ((r2 << 11) ^ r2) & 16777215;

  return r3;
}

function part2(input) {
  const lines = input.split("\n").map(Number);

  const prices = {};

  let max = 0;

  lines.forEach((line) => {
    let visited = {};
    let r = line;
    let p0, p1, p2, p3, price;
    let dp0, dp1, dp2, dp3;

    for (let i = 0; i < 2000; i++) {
      p0 = p1;
      p1 = p2;
      p2 = p3;
      p3 = price;
      price = r % 10;

      r = process(r);

      if (i > 3) {
        dp0 = p1 - p0;
        dp1 = p2 - p1;
        dp2 = p3 - p2;
        dp3 = price - p3;

        const k = key(dp0, dp1, dp2, dp3);

        if (!visited[k]) {
          prices[k] ??= 0;
          prices[k] += price;
          visited[k] = true;

          if (prices[k] > max) {
            max = prices[k];
          }
        }
      }
    }
  });

  console.log(max);
}

part2(read());
