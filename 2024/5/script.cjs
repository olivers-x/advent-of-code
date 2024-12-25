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

function removeFalseValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== false)
  );
}

const breaking = [];

function findPassing(entries, order) {
  const passing = {};

  function fuckingElf(mainArray, subArray) {
    function isSubArrayInOrder(array, subArray) {
      let first = -1;
      let second = -1;

      for (let i = 0; i <= array.length; i++) {
        // Check if the slice of array matches subArray
        if (first === -1 && subArray[0] === array[i]) {
          first = i;
        }

        if (second === -1 && subArray[1] === array[i]) {
          second = i;
        }
      }

      if (first === -1 || second === -1) {
        return true;
      }

      if (first < second && passing[array] !== false) {
        passing[array] = true;
        return true;
      } else {
        passing[array] = false;

        if (!breaking.includes(array)) {
          breaking.push(array);
        }
      }

      return false;
    }

    mainArray.forEach((array) => isSubArrayInOrder(array, subArray));
  }

  order.forEach((o) => fuckingElf(entries, o));

  return passing;
}

function switchEntries(entries, orders) {
  const passing = {};

  function isSubArrayInOrder(array, subArray) {
    let first = -1;
    let second = -1;

    for (let i = 0; i <= array.length; i++) {
      // Check if the slice of array matches subArray
      if (first === -1 && subArray[0] === array[i]) {
        first = i;
      }

      if (second === -1 && subArray[1] === array[i]) {
        second = i;
      }
    }

    if (first === -1 || second === -1) {
      return true;
    }

    if (first < second && passing[array] !== false) {
      passing[array] = true;
      return true;
    } else {
      passing[array] = false;
      array[first] = subArray[1];
      array[second] = subArray[0];
    }

    return false;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    orders.forEach((order) => {
      isSubArrayInOrder(entry, order);
    });
  }
}

function countArray(array) {
  const xxx = array
    .map((keys) => {
      const asArray = keys.split(",");
      const index = (asArray.length - 1) / 2;
      return parseInt(asArray[index], 10);
    })
    .reduce(sum, 0);

  return xxx;
}

function count(obj) {
  const result = removeFalseValues(obj);
  const allKeys = Object.keys(result);

  return countArray(allKeys);
}

async function main() {
  const order = await readFileLineByLine("input.txt");
  const manual = await readFileLineByLine("input2.txt");

  const parsedOrder = order.map((line) => line.split("|"));
  const parsedManual = manual.map((line) => line.split(","));

  const passing = findPassing(parsedManual, parsedOrder);

  const passingSum = count(passing);

  switchEntries(breaking, parsedOrder);

  let isOrdered = false;

  while (isOrdered === false) {
    const passing = findPassing(parsedManual, parsedOrder);
    switchEntries(breaking, parsedOrder);
    isOrdered =
      Object.keys(removeFalseValues(passing)).length === parsedManual.length;
  }

  const result = breaking
    .map((keys) => {
      const index = (keys.length - 1) / 2;
      return parseInt(keys[index], 10);
    })
    .reduce(sum, 0);

  console.log("part1", passingSum);
  console.log("part2", result);
}

main();
