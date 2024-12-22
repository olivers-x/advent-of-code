import { readFileSync } from "fs";

function read() {
  const [fileName] = process.argv.slice(-1);
  return readFileSync(fileName, { encoding: "utf-8", flag: "r" }).trimEnd();
}

const key = (d, c, b, a) =>
  (a + 9) * 19 ** 3 + (b + 9) * 19 ** 2 + (c + 9) * 19 + (d + 9);

function transformNumber(n) {
  let r1 = ((n << 6) ^ n) & 16777215;
  let r2 = (r1 >> 5) ^ r1;
  let r3 = ((r2 << 11) ^ r2) & 16777215;

  return r3;
}

function part2(input) {
  const lines = input.split("\n").map(Number);

  let max = 0;

  const prices = new Uint32Array(19 ** 4);

  for (let line of lines) {
    const visited = new Uint8Array(19 ** 4);
    let r = line;
    let p0, p1, p2, p3, price;
    let dp0, dp1, dp2, dp3;

    for (let i = 0; i < 2000; i++) {
      p0 = p1;
      p1 = p2;
      p2 = p3;
      p3 = price;
      price = r % 10;

      r = transformNumber(r);

      if (i > 3) {
        dp0 = p1 - p0;
        dp1 = p2 - p1;
        dp2 = p3 - p2;
        dp3 = price - p3;

        const k = key(dp0, dp1, dp2, dp3);

        if (!visited[k]) {
          const priceAtK = prices[k] ?? 0;
          const newPrice = priceAtK + price;
          prices[k] = newPrice;
          visited[k] = 1;

          if (newPrice > max) {
            max = newPrice;
          }
        }
      }
    }
  }

  console.log(max);
}

part2(read());
