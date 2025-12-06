import { evaluate } from 'mathjs';
import { read } from '../lib.mjs';

function part2(input) {
  const table = input.split('\n');

  console.table(table);

  const opIndex = 4;

  let result = 0;

  let numbers = [];

  for (let i = table[0].length; i >= 0; i--) {
    let number = '';

    for (let j = 0; j < opIndex; j++) {
      const n = table[j][i];
      if (n !== ' ' && n !== undefined) number = number + n;
    }

    if (number !== '') numbers.push(number);

    const op = table[opIndex][i];
    if (op === '+' || op === '*') {
      const expression = numbers.join(op);
      console.log(expression);
      const value = evaluate(expression);

      result += value;

      numbers = [];
    }
  }

  console.log(result);
}

part2(read());
