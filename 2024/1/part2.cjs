const fs = require("fs");
const readline = require("readline");

function toInt(input) {
  return parseInt(input, 10);
}

async function readFileLineByLine(filePath) {
  const list1 = [];
  const list2 = [];

  try {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Recognizes all instances of CR LF as line breaks
    });

    for await (const line of rl) {
      const [first, second] = line.split("   ");
      list1.push(toInt(first));
      list2.push(toInt(second));
    }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }

  return { list1, list2 };
}

function createHistogram(array) {
  const histogram = {};

  for (const num of array) {
    if (histogram[num]) {
      histogram[num]++;
    } else {
      histogram[num] = 1;
    }
  }

  return histogram;
}

async function main() {
  const { list1, list2 } = await readFileLineByLine("./input.txt");

  const list2histogram = createHistogram(list2);

  const distance = (first) => {
    const frequency = list2histogram[first] ?? 0;
    return frequency * first;
  };

  const sum = (a, b) => a + b;

  const list1distance = list1.map(distance);
  const total = list1distance.reduce(sum, 0);

  console.log(total);
}

main();
