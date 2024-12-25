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

const passingPart1 = new Set();

function checkPart1(result, i) {
  const operator = theOperators[i];

  if (i === 0) {
    if (result === theOperators[0]) passingPart1.add(theOne);
    return;
  }

  const isDivisible = result % operator === 0;

  if (isDivisible) {
    checkPart1(result / operator, i - 1);
  }

  checkPart1(result - operator, i - 1);
}

const passingPart2 = new Set();

function checkPart2(result, i) {
  const operator = theOperators[i];

  if (i === 0) {
    if (result === theOperators[0]) passingPart2.add(theOne);
    return;
  }

  const isDivisible = result % operator === 0;

  if (isDivisible) {
    checkPart2(result / operator, i - 1);
  }

  const nDigits = operator.toString().length;
  const base = 10 ** nDigits;
  const isConcat = (result - operator) % base === 0;

  if (isConcat) {
    checkPart2((result - operator) / base, i - 1);
  }

  checkPart2(result - operator, i - 1);
}

async function main() {
  const fileName = process.argv[process.argv.length - 1];
  const equations = await readFileLineByLine(fileName);

  for (let [result, operators_] of equations) {
    const operators = operators_.split(" ").map(Number);

    theOne = parseInt(result, 10);

    theOperators = operators;

    checkPart1(theOne, operators.length - 1);
  }

  console.log("part1", [...passingPart1].reduce(sum, 0));

  for (let [result, operators_] of equations) {
    const operators = operators_.split(" ").map(Number);

    theOne = parseInt(result, 10);

    theOperators = operators;

    checkPart2(theOne, operators.length - 1);
  }

  console.log("part2", [...passingPart2].reduce(sum, 0));
}

main();
