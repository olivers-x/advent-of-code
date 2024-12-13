import { readFileSync } from "fs";

export const sum = (a, b) => a + b;

export function unique(value, index, array) {
  return array.indexOf(value) === index;
}

export function read() {
  const fileName = process.argv[process.argv.length - 1];
  return readFileSync(fileName, { encoding: "utf-8", flag: "r" });
}

Array.prototype.reshape = function (rows, cols) {
  var copy = this.slice(0); // Copy all elements.
  const l = this.length;
  this.length = 0; // Clear out existing array.

  cols ??= l / rows;

  // if (!cols) cols = rows;

  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < cols; c++) {
      var i = r * cols + c;
      if (i < copy.length) {
        row.push(copy[i]);
      }
    }
    this.push(row);
  }

  return this;
};
