import { read, sum } from '../lib.mjs';

var arr = read().split('\n');
var beams = [];
for (let i = 0; i < arr[0].length; i++) {
  beams.push(0);
}
let splits = 0;
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    if (arr[i][j] === 'S') {
      beams[j] = 1;
    } else if (arr[i][j] === '^' && beams[j]) {
      splits++;
      beams[j - 1] += beams[j];
      beams[j + 1] += beams[j];
      beams[j] = 0;
    }
  }
}
var total = 0;
for (let i = 0; i < beams.length; i++) {
  total += beams[i];
}
console.log('Part 1: ' + splits);
console.log('Part 2: ' + total);
