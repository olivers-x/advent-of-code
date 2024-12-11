const toInt = (s) => parseInt(s, 10);

const SYMBOL = ".";

// part 2 try 1 = 10953462255713

function readFileLineByLine(path) {
  const lines = [];
  const file = std.open(path, "r"); // Open file in read mode
  if (!file) {
    console.error(`Cannot open file: ${path}`);
    os.exit(1);
  }

  let line;
  while ((line = file.getline()) !== null) {
    lines.push(line);
  }

  file.close(); // Don't forget to close the file

  return lines;
}

function part1(array, size) {
  let i = 0;
  let j = size - 1;
  let sum = 0;
  let counter = 0;

  while (j > i - 1) {
    if (array[i] !== SYMBOL) {
      sum += counter * array[i];
      //   std.out.printf(array[i]);
      i++;
    } else if (array[j] !== SYMBOL) {
      sum += counter * array[j];
      //   std.out.printf(array[j]);
      j--;
      i++;
    } else {
      j--;
      counter--;
    }

    counter++;
  }

  print();

  return sum;
}

let counter = 0;
let sum = 0;

function countItem(item) {
  const { symbol, count } = item;

  if (symbol !== SYMBOL) {
    sum += (symbol * count * (2 * counter + count - 1)) / 2;
  }

  counter += count;

  for (let i = 0; i < item.count; i++) {
    std.out.printf(item.symbol);
  }
}

function getGapChecksum(array, gap, size) {
  const gapSize = gap.count;
  size ??= array.length;

  if (gapSize <= 0) return 0;

  let sum = -1;

  //   console.log(gap.symbol, "start", start);

  for (let j = size - 1; j >= 0; j--) {
    const { count, symbol, used } = array[j];
    // console.log("j:", j, symbol);

    if (gapSize >= count && used === false && symbol !== SYMBOL) {
      sum++;
      array[j].used = true;

      countItem(array[j]);

      const gapSum = 1;

      sum += gapSum;
      gap.count = gapSize - count;

      if (gap.count > 0) {
        let r = getGapChecksum(array, gap, j);

        if (r === -1) {
          countItem({ symbol: ".", count: gap.count });
        } else {
          sum += r;
        }
      }

      return sum;
    }
  }

  return sum;
}

function findGapToFill(array, j) {
    for(let i = 0; i < j; i++) {
        const item = array[i];

        if (item.symbol === SYMBOL) {

        }
    }
}

function checksum_part2(array, size) {
  let sum = 0;
  let i = 0;
  let j = size - 1;

  while(j>=0) {
    const { symbol, count, used } = array[j];

    if (symbol === SYMBOL) {
        // find gap to fill
        findGapToFill(array, j);
    }
  }

//   while (i < size) {
//     const { symbol, count, used } = array[i];

//     if (symbol !== SYMBOL) {
//       if (!used) {
//         // already moved, now its a gap
//         countItem(array[i]);
//       } else {
//         countItem({ symbol: ".", count });
//       }
//     } else {
//       // there is a gap
//       const gap = array[i];
//       let gapSum = getGapChecksum(array, gap);

//       if (gapSum === -1) {
//         // partially filled gap, put the rest
//         countItem({ symbol: ".", count: gap.count });
//       }
//     }

//     i++;
  }

  print();

  return sum;
}

function main() {
  const fileName = scriptArgs[scriptArgs.length - 1];
  const [line] = readFileLineByLine(fileName);

  let arraySize = 0;

  const size = line.length;
  for (let i = 0; i < size; i++) {
    arraySize += toInt(line[i]);
  }

  console.log("test input size", size);
  //   print(line);
  //   print("---------------");

  //   const array = [];
  const array2 = Array(size);

  for (let id = 0; id < size; id++) {
    const number = toInt(line[id]);
    const fill = id % 2 === 0 ? id / 2 : SYMBOL;

    // for (let i = 0; i < number; i++) array.push(fill);

    const item = { symbol: fill, count: number, used: false };
    array2[id] = item;
  }

  print();
  //   print(array.join(""));

  //   print("checksum part 1");
  //   print(checksum(array, array.length));

  print("checksum part 2");

  checksum_part2(array2, size);

  print(sum);
}

main();
