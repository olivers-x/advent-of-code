import { read } from "../lib.mjs";

function part2(input) {
  let [, gates] = input.split("\n\n");
  gates = gates.split("\n");
  let swapped = [];

  function findGate(a, b, operator) {
    return gates
      .find((gate) => {
        return (
          gate.startsWith(`${a} ${operator} ${b}`) ||
          gate.startsWith(`${b} ${operator} ${a}`)
        );
      })
      ?.split(" -> ")
      .pop();
  }

  function swap() {
    let c0;
    for (let i = 0; i <= 44; i++) {
      let n = i.toString().padStart(2, 0);
      let m1, n1, r1, z1, c1;

      // x1 XOR y1 => m1
      // x1 AND y1 => n1
      // c0 AND m1 => r1
      // c0 XOR m1 -> z1
      // r1 OR  n1 -> c1
      m1 = findGate(`x${n}`, `y${n}`, "XOR");
      n1 = findGate(`x${n}`, `y${n}`, "AND");

      if (c0) {
        r1 = findGate(c0, m1, "AND");
        if (!r1) {
          [n1, m1] = [m1, n1];
          swapped.push(m1, n1);
          r1 = findGate(c0, m1, "AND");
        }

        z1 = findGate(c0, m1, "XOR");

        if (m1?.startsWith("z")) {
          [m1, z1] = [z1, m1];
          swapped.push(m1, z1);
        }

        if (n1?.startsWith("z")) {
          [n1, z1] = [z1, n1];
          swapped.push(n1, z1);
        }

        if (r1?.startsWith("z")) {
          [r1, z1] = [z1, r1];
          swapped.push(r1, z1);
        }

        c1 = findGate(r1, n1, "OR");
      }

      if (c1?.startsWith("z") && c1 !== "z45") {
        [c1, z1] = [z1, c1];
        swapped.push(c1, z1);
      }

      if (c0) {
        c0 = c1;
      } else {
        c0 = n1;
      }
    }
  }

  swap();
  console.log(swapped.sort().join(","));
}

part2(read());
