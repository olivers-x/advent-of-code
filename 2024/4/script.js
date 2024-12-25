const fs = require("fs");
const readline = require("readline");

async function readFileLineByLine(filePath) {
  const lines = [];

  try {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Recognizes all instances of CR LF as line breaks
    });

    for await (const line of rl) {
      lines.push(line.split(""));
    }
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
  }

  return lines;
}

function findSubMatrix(matrix, subMatrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const subRows = subMatrix.length;
  const subCols = subMatrix[0].length;

  const result = [];

  function isMatch(startRow, startCol) {
    for (let i = 0; i < subRows; i++) {
      for (let j = 0; j < subCols; j++) {
        if (subMatrix[i][j] === ".") continue;
        // If out of bounds or not a match
        if (
          startRow + i >= rows ||
          startCol + j >= cols ||
          (matrix[startRow + i][startCol + j] !== subMatrix[i][j] &&
            subMatrix[i][j] !== ".")
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // Iterate through all possible starting points in the main matrix
  for (let i = 0; i <= rows - subRows; i++) {
    for (let j = 0; j <= cols - subCols; j++) {
      if (isMatch(i, j)) {
        result.push({ start: [i, j] });
      }
    }
  }

  return result; // Sub-matrix not found
}

const PATTERN1 = [
  ["M", ".", "S"],
  [".", "A", "."],
  ["M", ".", "S"],
];

const PATTERN2 = [
  ["S", ".", "M"],
  [".", "A", "."],
  ["S", ".", "M"],
];

const PATTERN3 = [
  ["M", ".", "M"],
  [".", "A", "."],
  ["S", ".", "S"],
];

const PATTERN4 = [
  ["S", ".", "S"],
  [".", "A", "."],
  ["M", ".", "M"],
];

const XMAS_PATTERN5 = [
  ["X", ".", ".", "."],
  [".", "M", ".", "."],
  [".", ".", "A", "."],
  [".", ".", ".", "S"],
];

const XMAS_PATTERN6 = [
  ["S", ".", ".", "."],
  [".", "A", ".", "."],
  [".", ".", "M", "."],
  [".", ".", ".", "X"],
];

const XMAS_PATTERN7 = [
  [".", ".", ".", "S"],
  [".", ".", "A", "."],
  [".", "M", ".", "."],
  ["X", ".", ".", "."],
];

const XMAS_PATTERN8 = [
  [".", ".", ".", "X"],
  [".", ".", "M", "."],
  [".", "A", ".", "."],
  ["S", ".", ".", "."],
];

async function main() {
  const grid = await readFileLineByLine("./input.txt");

  const r1 = findSubMatrix(grid, [["X", "M", "A", "S"]]).length;
  const r2 = findSubMatrix(grid, [["S", "A", "M", "X"]]).length;
  const r3 = findSubMatrix(grid, [["X"], ["M"], ["A"], ["S"]]).length;
  const r4 = findSubMatrix(grid, [["S"], ["A"], ["M"], ["X"]]).length;
  const r5 = findSubMatrix(grid, XMAS_PATTERN5).length;
  const r6 = findSubMatrix(grid, XMAS_PATTERN6).length;
  const r7 = findSubMatrix(grid, XMAS_PATTERN7).length;
  const r8 = findSubMatrix(grid, XMAS_PATTERN8).length;

  console.log("part1", r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8);

  const result1 = findSubMatrix(grid, PATTERN1);
  const result2 = findSubMatrix(grid, PATTERN2);
  const result3 = findSubMatrix(grid, PATTERN3);
  const result4 = findSubMatrix(grid, PATTERN4);

  console.log(
    "part2",
    result1.length + result2.length + result3.length + result4.length
  );
}

main();
