import { read, toInt } from '../lib.mjs';

function part2(input) {
  const lines = input.split('\n');

  let p = 50;
  let counter = 0;

  for (let line of lines) {
    let v = toInt(line.substring(1));
    const isLeft = line[0] === 'L';

    while (v >= 100) {
      v -= 100;
      counter++;
    }

    if (isLeft) {
      if (p === 0) p = 100;
      p -= v;
    } else {
      if (p === 100) p = 0;
      p += v;
    }

    if (p < 0) {
      p += 100;
      counter++;
    }

    if (p > 100) {
      p -= 100;
      counter++;
    }

    if (p === 0 || p === 100) {
      counter++;
    }
  }
  console.log(counter);
}

part2(read());
