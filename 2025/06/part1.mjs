import { evaluate } from 'mathjs';
import { read } from '../lib.mjs';

function part1(input) {
  const table = input
    .split('\n')
    .map((line) => line.trim().replaceAll(/( )+/g, ' ').split(' '));

  console.table(table.length);

  const opIndex = 4;

  let result = 0;

  for (let i = 0; i < table[0].length; i++) {
    const op = table[opIndex][i];
    let numbers = [];

    for (let j = 0; j < opIndex; j++) {
      const n = table[j][i];
      numbers.push(n);
    }

    const expression = numbers.join(op);
    const value = evaluate(expression);

    result += value;
  }

  console.log(result);
}

part1(read());
