import * as Mathjs from "mathjs";
import { read, sum } from "../lib.mjs";

function isWithinEpsilon(number, epsilon = 0.001) {
  return Math.abs(number - Math.round(number)) <= epsilon;
}

const regex = /\d+/g;

const math = Mathjs.create(Mathjs.all, { number: "bigint" });

async function part2(input) {
  const all = input.split("\n");
  all.push("");
  const conditions = all.reshape(all.length / 4, 4);

  const price = conditions
    .map((condition) => {
      const [a1, a2] = condition[0].match(regex);
      const [b1, b2] = condition[1].match(regex);
      let [aR, bR] = condition[2].match(regex);

      aR = 10000000000000n + BigInt(aR);
      bR = 10000000000000n + BigInt(bR);

      const [[a], [b]] = math.lusolve(
        [
          [a1, b1],
          [a2, b2],
        ],
        [aR, bR]
      );

      if (a > 0 && b > 0 && isWithinEpsilon(a) && isWithinEpsilon(b)) {
        return BigInt(Math.round(a)) * 3n + BigInt(Math.round(b));
      }

      return 0n;
    })
    .reduce(sum);

  return price;
}

console.log(await part2(read()));

// 2312633642825590265 // too high
// 87550094242995 // correct
