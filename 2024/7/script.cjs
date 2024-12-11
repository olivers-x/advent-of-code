const fs = require("fs");
const readline = require("readline");

const sum = (a, b) => a + b;

async function readFileLineByLine(filePath) {
  const lines = [];

  try {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Recognizes all instances of CR LF as line breaks
    });

    for await (const line of rl) {
      lines.push(line.split(": "));
    }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }

  return lines;
}

let theOne;
let theOperators;

const passing = new Set();

function check(result, i) {
  const operator = theOperators[i];

  if (i === 0) {
    if (result === theOperators[0]) passing.add(theOne);
    return;
  }

  const isDivisible = result % operator === 0;

  if (isDivisible) {
    check(result / operator, i - 1);
  }

  const nDigits = operator.toString().length;
  const base = 10 ** nDigits;
  const isConcat = (result - operator) % base === 0;

  if (isConcat) {
    check((result - operator) / base, i - 1);
  }

  check(result - operator, i - 1);
}

async function main() {
  const fileName = process.argv[process.argv.length - 1];
  const equations = await readFileLineByLine(fileName);

  //   console.table(equations);

  for (let [result, operators_] of equations) {
    const operators = operators_.split(" ").map(Number);

    theOne = parseInt(result, 10);

    theOperators = operators;

    check(theOne, operators.length - 1);
  }

  console.log([...passing].reduce(sum, 0));
}

main();
