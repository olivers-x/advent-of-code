import { init } from 'z3-solver';

import { read } from '../lib.mjs';

async function solve(target, operations) {
  const { Context } = await init();
  const z3 = new Context('main');

  for (let steps = 1; steps <= 10; steps++) {
    process.stdout.write(`Trying ${steps} step(s)... `);

    const solver = new z3.Solver();
    const { Bool, Int, Or, Xor, And } = z3;

    const states = [];
    const actions = [];

    // 1. Create Variables for this timeline
    for (let i = 0; i <= steps; i++) {
      const s = {};
      for (const a in target) {
        s[a] = Bool.const(`${a}_${i}`);
      }

      states.push(s);
      if (i < steps) {
        const act = Int.const(`action_${i}`);
        actions.push(act);
        solver.add(act.ge(0), act.le(operations.length - 1));
      }
    }

    // 2. Initial State
    for (const a in target) {
      solver.add(states[0][a].eq(false));
    }

    // 3. Transitions
    for (let i = 0; i < steps; i++) {
      const act = actions[i];

      for (const a in target) {
        const curr = states[i][a];
        const next = states[i + 1][a];

        const relevantOpIds = operations
          .filter((op) => op.affects.includes(a))
          .map((op) => op.id);

        if (relevantOpIds.length === 0) {
          solver.add(next.eq(curr));
        } else {
          const conditions = relevantOpIds.map((id) => act.eq(id));

          solver.add(next.eq(Xor(curr, Or(...conditions))));
        }
      }
    }

    // 4. Goal State
    for (const a in target) {
      solver.add(states[steps][a].eq(target[a]));
    }

    // 5. Check
    if ((await solver.check()) === 'sat') {
      const model = solver.model();
      console.log('\nMinimum Operations:');

      for (let i = 0; i < steps; i++) {
        const actId = parseInt(model.eval(actions[i]).toString());
        const op = operations.find((o) => o.id === actId);

        console.log(`${i + 1}. Apply ${op.name}`);
      }

      // Exit immediately after finding the shortest path
      return steps;
    }
  }

  return Infinity;
}

const getTarget = (diagram) => {
  const state = {};
  for (let c = 1; c < diagram.length - 1; c++) {
    state[`a${c - 1}`] = diagram[c] === '#' ? 1 : 0;
  }
  return state;
};

const getOperations = (buttons) =>
  buttons.map((op, i) => ({
    id: i,
    name: op,
    affects: op
      .replace('(', '')
      .replace(')', '')
      .split(',')
      .map((a) => 'a' + a),
  }));

async function part1(input) {
  const lines = input.split('\n').map((line) => line.split(' '));
  let total = 0;

  for (let line of lines) {
    const [diagram, ...buttons] = line;
    buttons.pop();

    const target = getTarget(diagram);
    const operations = getOperations(buttons);

    console.log(target);
    console.log(operations);

    const s = await solve(target, operations);
    total += s;
    console.log('steps', s);
  }

  console.log('total steps', total);
}

await part1(read());
