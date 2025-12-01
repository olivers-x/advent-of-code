import { read, toInt } from '../lib.mjs';

function part1(input) {
  const lines = input.split('\n');

  let p = 50;
  let counter = 0;

  for (let line of lines) {
    console.log(line);
    if (line.startsWith('L')) p -= toInt(line.substring(1));
    if (line.startsWith('R')) p += toInt(line.substring(1));

    p = p % 100;

    if (p === 0) counter++;
  }

  console.log(counter);
}

part1(read());
