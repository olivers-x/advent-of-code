import { read, toInt } from '../lib.mjs';

const allEqual = (arr) => arr.every((val) => val === arr[0]);

function isInvalid(number) {
  const string = number.toString();

  for (let i = string.length - 1; i > 0; i--) {
    if (string.length % i !== 0) continue;

    const r = new RegExp(`.{1,${i}}`, 'g');

    const parts = string.match(r);

    if (allEqual(parts)) return true;
  }

  return false;
}

function isInvalidNumerical(number) {
  const L = number.toString().length;

  for (let k = L - 1; k > 0; k--) {
    if (L % k !== 0) continue;

    // 3. Create the Periodicity Mask
    // Formula: (10^L - 1) / (10^k - 1)
    // Example for 1212 (L=4, k=2): (9999 / 99) = 101
    const numerator = Math.pow(10, L) - 1;
    const denominator = Math.pow(10, k) - 1;
    const mask = numerator / denominator;

    // 4. Check if the number is divisible by the mask
    if (number % mask === 0) {
      return true;
    }
  }

  return false;
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
