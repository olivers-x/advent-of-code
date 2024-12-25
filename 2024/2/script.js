const fs = require("fs");
const readline = require("readline");

function toInt(input) {
  return parseInt(input, 10);
}

function mySort(input, compareFunction) {
  const copy = [...input];
  return copy.sort(compareFunction);
}

async function readFileLineByLine(filePath) {
  const list = [];

  try {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Recognizes all instances of CR LF as line breaks
    });

    for await (const line of rl) {
      const numbers = line.split(" ");
      list.push(numbers.map(toInt));
    }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }

  return list;
}

async function main() {
  const list = await readFileLineByLine("./input.txt");

  function checkLine(line) {
    if (line.length < 2) return false;
    const increasing = line[0] < line[1] ? -1 : 1;

    const copy = line.toString();
    const sorted = mySort(line, (a, b) => (b - a) * increasing);

    if (copy != sorted) return false;

    const distances = sorted.map((x, i) => {
      if (increasing === 1) {
        return (sorted[i + 1] - x) * -1;
      }

      return (x - sorted[i + 1]) * -1;
    });

    for (let i = 0; i < distances.length - 1; i++) {
      if (distances[i] < 1 || distances[i] > 3) return false;
    }

    return true;
  }

  let safeCount = 0;

  const result = list.map((line) => {
    const isSafe = checkLine(line);

    if (isSafe) {
      safeCount++;
      return true;
    }

    // remove item by item and check again
    for (let i = 0; i < line.length; i++) {
      const copy = [...line];
      copy.splice(i, 1);
      const r = checkLine(copy);
      if (r) {
        return true;
      }
    }

    return false;
  });

  console.log("part 1", safeCount);
  console.log("part 2", result.filter(Boolean).length);
}

main();
