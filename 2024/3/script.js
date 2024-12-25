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
      lines.push(line);
    }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }

  return lines;
}

function extractNumbers(input) {
  const regex = /mul\((\d+),(\d+)\)/; // Regex to capture two numbers
  const match = input.match(regex); // Match the input string with the regex

  if (match) {
    const num1 = parseInt(match[1], 10); // First number
    const num2 = parseInt(match[2], 10); // Second number
    return [num1, num2]; // Return the numbers as an array
  } else {
    throw new Error("Invalid format: input does not match 'mul(x,y)'");
  }
}

function removeBetween(input) {
  const regex = /don\'t\(\).*?do\(\)/g;
  return input.replace(regex, "");
}

function countMul(input) {
  const regex = /mul\(\d+,\d+\)/g;
  const parsed = [...input.matchAll(regex)];

  return parsed
    .map((mul) => {
      const [first, second] = extractNumbers(mul[0]);
      return first * second;
    })
    .reduce(sum, 0);
}

const inputString =
  "This is a do() sample don't() string  do() with don't()[extra content]do() to remove.";
const result = removeBetween(inputString);
console.log(result);

async function main() {
  const lines = await readFileLineByLine("input.txt");

  const together = lines.reduce(sum, "");
  const filtered = removeBetween(together);

  console.log("part1", countMul(together));
  console.log("part2", countMul(filtered));
}

main();
