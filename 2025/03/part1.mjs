import { read, toInt } from '../lib.mjs';

function part1(input) {
  const lines = input.split('\n');

  console.table(lines);

  let sum = 0;

  for (const line of lines) {
    const array = line.split('').map(toInt);
    const last = array.pop();
    const max = Math.max.apply(null, array);
    const maxI = array.indexOf(max);
    array.push(last);
    const max2 = Math.max(...array.slice(maxI + 1));

    console.log(line, '::', max, max2);
    sum += toInt(`${max}${max2}`);
  }

  console.log(sum);
}

part1(read());
