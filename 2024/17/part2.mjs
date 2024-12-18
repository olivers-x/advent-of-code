import { read } from "../lib.mjs";

function checkWithA(registerA, program) {
  let A = registerA;
  let B = 0;
  let C = 0;

  const output = [];

  const queue = program.split(" ")[1].split(",").map(Number);

  let instructionPointer = 0;

  const combo = (operand) => {
    if (operand === 0) return 0;
    if (operand === 1) return 1;
    if (operand === 2) return 2;
    if (operand === 3) return 3;
    if (operand === 4) return A;
    if (operand === 5) return B;
    if (operand === 6) return C;
    if (operand === 7) throw new Error("7");
  };

  const adv = (operand) => {
    const denominator = 2 ** combo(operand);
    A = Math.floor(A / denominator);
  };

  const bxl = (operand) => {
    B ^= operand;
  };

  const bst = (operand) => {
    B = combo(operand) & 7;
  };

  const jnz = (operand) => {
    if (A === 0) return;

    instructionPointer = operand - 2;
  };

  const bxc = () => {
    B ^= C;
  };

  const bdv = (operand) => {
    const denominator = 2 ** combo(operand);
    B = Math.floor(A / denominator);
  };

  const cdv = (operand) => {
    const denominator = 2 ** combo(operand);
    C = Math.floor(A / denominator);
  };

  const out = (operand) => {
    output.push(combo(operand) & 7);
  };

  const INSTRUCTIONS = {
    0: adv,
    1: bxl,
    2: bst,
    3: jnz,
    4: bxc,
    5: out,
    6: bdv,
    7: cdv,
  };

  while (instructionPointer < queue.length) {
    const opcode = queue[instructionPointer];
    const operand = queue[instructionPointer + 1];

    INSTRUCTIONS[opcode]?.(operand);

    instructionPointer += 2;
  }

  return output.join(",");
}

function main() {
  const input = read();
  const [registers, program] = input.split("\n\n");

  let [A] = registers
    .split("\n")
    .map((register) => Number(register.split(" ")[2]));

  const wanted = Number(program.split(" ")[1].split(",").join(""));

  console.log(wanted);

  const r = checkWithA(2415751603465530 << 3, program);

  console.log(r);
}

main();
