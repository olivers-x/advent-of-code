import { read } from "../lib.mjs";

function main() {
  const input = read();
  const [, program] = input.split("\n\n");

  let wanted = program.split(" ")[1];

  console.log(compute(51064159n));
  console.log(compute(136904920099226n));
  console.log(wanted);

  let res = 0n;
  for (let len = wanted.length - 1; len >= 0; len -= 2) {
    console.log(res);
    res = res << 3n;
    const currTarget = "," + wanted.slice(len);
    console.log(currTarget);
    while (true) {
      const result = compute(res);
      if (result === currTarget) break;
      res++;
    }
  }

  console.log(res);

  /**
   * 101635n ->                 4,6,5,5,3,0  11000110100000011
   * 813080n ->               3,4,6,5,5,3,0  11000110100000011000
   * 416300695n ->      1,6,0,3,4,6,5,5,3,0  11000110100000011111010010111
   * 4178006594n ->   5,1,6,0,3,4,6,5,5,3,0  11111001000001110101001001000010
   */
}

main();

/// 2,4 1,5 7,5 1,6 0,3 4,6 5,5 3,0
/*
    bst 4 : B = A & 7;
    bxl 5 : B ^= 5;
    cdv 5 : C = A >> B;
    bxl 6 : B ^= 6;
    adv 3 : A = A >> 3;
    bxc 6 : B ^= C;
    out 5 : process.stdout.write("," + (B & 7));
    jnz 0 : if A !== 0 jump to 0
*/

function compute(a) {
  let A = a;
  let B = 0n;
  let C = 0n;

  let out = "";

  while (true) {
    B = A & 7n;
    B ^= 5n;
    C = A >> B;
    B ^= C ^ 6n;
    A = A >> 3n;
    out += "," + (B & 7n);
    if (A == 0) break;
  }

  return out;
}
