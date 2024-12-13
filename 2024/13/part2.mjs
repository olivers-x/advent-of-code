import * as Mathjs from "mathjs";
import { read, sum } from "../lib.mjs";

function isWithinEpsilon(number, epsilon = 0.001) {
  return Math.abs(number - Math.round(number)) <= epsilon;
}

function isWhole(a) {
  return a == Math.round(a);
}

const regex = /\d+/g;

const math = Mathjs.create(Mathjs.all, { number: "bigint" });

async function part2(input) {
  const lines = input.split("\n\n");

  const price = lines
    .map((line) => {
      const condition = line.split("\n");
      const [a1, a2] = condition[0].match(regex);
      const [b1, b2] = condition[1].match(regex);
      let [c1, c2] = condition[2].match(regex);

      c1 = 10000000000000n + BigInt(c1);
      c2 = 10000000000000n + BigInt(c2);

      // https://en.wikipedia.org/wiki/Cramer%27s_rule
      const cm = [
        [a1, b1],
        [a2, b2],
      ];

      const xm = [
        [c1, b1],
        [c2, b2],
      ];

      const ym = [
        [a1, c1],
        [a2, c2],
      ];

      const x = math.chain(math.det(xm)).divide(math.det(cm)).done();
      const y = math.chain(math.det(ym)).divide(math.det(cm)).done();

      if (isWhole(x) && isWhole(y)) {
        return BigInt(x) * 3n + BigInt(y);
      }

      return 0n;
    })
    .reduce(sum);

  return price;
}

const r = await part2(read());
console.assert(r === 87550094242995n, { r });
console.log(r);

// 2312633642825590265 // too high
// 87550094242995 // correct
