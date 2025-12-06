import { evaluate } from 'mathjs';
import { read, isNumber } from '../lib.mjs';

function part2(input) {
  const table = input.split('\n');
  const width = table[0].length;
  const opIndex = table.length - 1;

  const resultState = Array.from({ length: width }, (_, i) => i)
    .reverse()
    .reduce(
      (state, i) => {
        const number = table
          .slice(0, opIndex)
          .map((row) => row[i])
          .filter(isNumber)
          .join('');

        if (number !== '') {
          state.numbers.push(number);
        }

        const op = table[opIndex][i];

        if (op === '+' || op === '*') {
          state.result += evaluate(state.numbers.join(op));
          state.numbers = [];
        }

        return state;
      },
      { result: 0, numbers: [] }
    );

  // 10600728112865
  console.log(resultState.result);
}

part2(read());
