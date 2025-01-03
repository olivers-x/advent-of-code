import * as Mathjs from "mathjs";
import { read, sum } from "../lib.mjs";

const regex = /\d+/g;

const math = Mathjs.create(Mathjs.all, { number: "number" });

async function part2(input) {
  const lines = input.split("\n\n");

  const price = lines
    .map((line) => {
      const condition = line.split("\n");
      const [a1, a2] = condition[0].match(regex);
      const [b1, b2] = condition[1].match(regex);
      let [c1, c2] = condition[2].match(regex);

      c1 = 10000000000000 + Number(c1);
      c2 = 10000000000000 + Number(c2);

      // https://en.wikipedia.org/wiki/Cramer%27s_rule
      const detX = math.det([
        [c1, b1],
        [c2, b2],
      ]);

      const detY = math.det([
        [a1, c1],
        [a2, c2],
      ]);

      const det = math.det([
        [a1, b1],
        [a2, b2],
      ]);

      if (detX % det !== 0 || detY % det !== 0) {
        return 0n;
      }

      const x = math.chain(detX).divide(det).done();
      const y = math.chain(detY).divide(det).done();

      return BigInt(x) * 3n + BigInt(y);
    })
    .reduce(sum);

  return price;
}

const r = await part2(read());

console.log(r);
