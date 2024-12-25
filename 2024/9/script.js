const toInt = (s) => parseInt(s, 10);

const SYMBOL = ".";

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
      i++;
    } else if (array[j] !== SYMBOL) {
      sum += counter * array[j];
      j--;
      i++;
    } else {
      j--;
      counter--;
    }

    counter++;
  }

  return sum;
}

function checksum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== SYMBOL) {
      sum += i * array[i];
    }
  }

  return sum;
}

function findGap(array, size, _gapStart) {
  const arraySize = array.length;
  let gapStart = _gapStart;
  let gapSize = 0;

  while (gapSize < size && gapStart < arraySize) {
    while (
      array[gapStart] !== SYMBOL &&
      array[gapStart + gapSize] !== undefined
    )
      gapStart++;

    while (
      array[gapStart + gapSize] === SYMBOL &&
      array[gapStart + gapSize] !== undefined
    )
      gapSize++;

    if (gapSize < size) {
      gapStart += gapSize;
      gapSize = 0;
    }
  }

  return { gapStart, gapSize };
}

function part2(array, size) {
  let gapStart = 0;
  let movedSymbol;

  for (let j = size - 1; j > 0; ) {
    while ((array[j] === SYMBOL || array[j] > movedSymbol) && j > 0) j--;
    const symbol = array[j];
    const start = j;
    while (array[j] === symbol && j > 0) j--;
    const l = start - j;

    const gap = findGap(array, l, gapStart);

    if (gap.gapSize > 0 && gap.gapStart < j) {
      array.fill(symbol, gap.gapStart, gap.gapStart + l);
      array.fill(SYMBOL, j + 1, j + 1 + l);
    }

    movedSymbol = symbol;
  }
}

function main() {
  const fileName = scriptArgs[scriptArgs.length - 1];
  const [line] = readFileLineByLine(fileName);

  const size = line.length;

  const array = [];

  for (let id = 0; id < size; id++) {
    const number = toInt(line[id]);
    const fill = id % 2 === 0 ? id / 2 : SYMBOL;

    for (let i = 0; i < number; i++) array.push(fill);
  }

  print("part 1: " + part1(array, array.length));

  part2(array, array.length);

  print("part 2: " + checksum(array));
}

main();
