import { read } from "../lib.mjs";

function part1(input) {
  const [registers, program] = input.split("\n\n");

  let [A, B, C] = registers
    .split("\n")
    .map((register) => Number(register.split(" ")[2]));

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
    B = combo(operand) % 8;
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
    process.stdout.write("," + (combo(operand) % 8));
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

  console.log();
}

part1(read());
