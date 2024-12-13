import { readFileSync } from "fs";
import { parse, lusolve } from "mathjs";
import "../lib.mjs";

function read(filePath) {
  return readFileSync(filePath, { encoding: "utf-8", flag: "r" });
}

function isWithinEpsilon(number, epsilon = 0.001) {
  return Math.abs(number - Math.round(number)) <= epsilon;
}

const regex = /\d+/g; // Matches any number with optional "+" or "-" sign

async function part1(input) {
  const all = input.split("\n");
  all.push("");
  const size = all.length / 4;

  const conditions = all.reshape(size, 4);
  console.table(conditions);

  let price = 0;
  for (let condition of conditions) {
    const [a1, a2] = condition[0].match(regex);
    const [b1, b2] = condition[1].match(regex);
    const [aR, bR] = condition[2].match(regex);

    const eq = [`${a1}a + ${b1}b = ${aR}`, `${a1}a + ${b2}b = ${bR}`];
    console.log(eq);

    const [[a], [b]] = lusolve(
      [
        [a1, b1],
        [a2, b2],
      ],
      [aR, bR]
    );

    console.log("a", a, "b", b);
    if (isWithinEpsilon(a)) {
      console.log("ok");
      price += a * 3 + Math.round(b);
    }
  }

  console.log("total", price);
}

const fileName = process.argv[process.argv.length - 1];
await part1(read(fileName).trimEnd());
