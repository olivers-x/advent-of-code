import { read, toInt } from '../lib.mjs';

function isInvalid(number) {
  const s = number.toString();
  const twice = s + s;
  return twice.indexOf(s, 1) !== s.length;
}

function part2(input) {
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

part2(read());
