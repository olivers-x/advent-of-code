import { read, toInt } from '../lib.mjs';

const N = 12;

function findMax(array, from, to) {
  let max = 0;
  let index = -1;
  for (let i = from; i <= to; i++) {
    if (array[i] > max) {
      max = array[i];
      index = i;
    }
  }

  return { max, index };
}

function part2(input) {
  const lines = input.split('\n');

  let sum = 0;

  for (const line of lines) {
    let array = line.split('').map(toInt);
    let i = 0,
      j = array.length - N;

    let lineSum = 0;

    for (let n = 0; n < N; n++) {
      const { max, index } = findMax(array, i, j);
      lineSum = lineSum * 10 + max;
      i = index + 1;
      j++;
    }

    sum += lineSum;
  }

  console.log(sum);
}

part2(read());
