import { read, toInt } from '../lib.mjs';

function isInvalid(number) {
  const string = number.toString();

  if (string.length % 2 === 1) return false;

  const partOne = string.slice(0, string.length / 2);
  const partTwo = string.slice(string.length / 2, string.length);

  return partOne === partTwo;
}

function part1(input) {
  const ranges = input.split(',');

  console.log(ranges);

  let counter = 0;

  for (let range of ranges) {
    const [from, to] = range.split('-').map(toInt);

    for (let i = from; i <= to; i++) {
      if (isInvalid(i)) counter += i;
    }
  }

  console.log(counter);
}

part1(read());
