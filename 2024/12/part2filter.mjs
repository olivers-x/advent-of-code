import { readFileSync } from "fs";
import { direct as convolution } from "ml-matrix-convolution";

const sum = (a, b) => a + b;

function unique(value, index, array) {
  return array.indexOf(value) === index;
}

Array.prototype.reshape = function (rows, cols) {
  var copy = this.slice(0); // Copy all elements.
  this.length = 0; // Clear out existing array.

  cols ??= rows;

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

function read(filePath) {
  return readFileSync(filePath, { encoding: "utf-8", flag: "r" });
}

async function part2(input) {
  const map = input.split("\n").map((line) => line.split(""));
  const size = map.length;

  const flattened = map.flat();

  const total = flattened
    .filter(unique)
    .map((symbol) => {
      const m1 = flattened.map((s) => (s === symbol ? 1 : 0)).reshape(size);

      const corners = convolution(m1, [
        [-1, 1],
        [1, -1],
      ]);
      const nCorners = corners.flat().map(Math.abs).reduce(sum);

      const horizontal = convolution(m1, [[1, -1]]).filter(Boolean).length;
      const vertical = convolution(m1, [[1], [-1]]).filter(Boolean).length;
      const area = flattened.filter((s) => s === symbol).length;
      const perimeter = horizontal + vertical;

      console.log(symbol, "a=", area, "s=", nCorners);

      return area * nCorners;
    })
    .reduce(sum);

  console.log(total);
}

const fileName = process.argv[process.argv.length - 1];
await part2(read(fileName).trimEnd());
