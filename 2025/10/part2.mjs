import Solver from 'javascript-lp-solver';

import { read } from '../lib.mjs';

async function solve(targets, operations) {
  const model = {
    optimize: 'cost',
    opType: 'min',
    constraints: {}, // Will hold: a0 = 3, a1 = 5...
    variables: {}, // Will hold: op(0,1), op(1,2)...
    ints: {}, // Which variables must be integers? (All of them)
  };

  // Constraints - Targets
  for (const [key, val] of Object.entries(targets)) {
    model.constraints[key] = { equal: val };
  }

  // Variables - Operations
  operations.forEach((op) => {
    const varDef = { cost: op.cost };
    op.affects.forEach((target) => {
      varDef[target] = 1; // Adds 1 to this target
    });

    model.variables[op.name] = varDef;
    model.ints[op.name] = 1;
  });

  const result = Solver.Solve(model);
  return result.result;
}

const getOperations = (buttons) =>
  buttons.map((op, i) => ({
    id: i,
    name: op,
    cost: 1,
    affects: op
      .replace('(', '')
      .replace(')', '')
      .split(',')
      .map((a) => 'a' + a),
  }));

const getTargets = (joltage) => {
  const target = {};

  joltage
    .replace('{', '')
    .replace('}', '')
    .split(',')
    .map(Number)
    .forEach((c, i) => {
      target[`a${i}`] = Number(c);
    });

  return target;
};

async function part2(input) {
  const lines = input.split('\n').map((line) => line.split(' '));
  let total = 0;

  for (let line of lines) {
    const [, ...buttons] = line;
    const targets = getTargets(buttons.pop());
    const operations = getOperations(buttons);

    const steps = await solve(targets, operations);
    console.log('steps', steps);
    total += steps;
  }

  console.log('total steps', total);
}

await part2(read());
