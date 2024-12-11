const fs = require("fs");
const readline = require("readline");

const sum = (a, b) => a + b;

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

  // Helper function to check if the sub-matrix matches
  function isMatch(startRow, startCol) {
    for (let i = 0; i < subRows; i++) {
      for (let j = 0; j < subCols; j++) {
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

async function main() {
  const grid = await readFileLineByLine("./input.txt");

  console.log(grid);

  const result1 = findSubMatrix(grid, PATTERN1);
  const result2 = findSubMatrix(grid, PATTERN2);
  const result3 = findSubMatrix(grid, PATTERN3);
  const result4 = findSubMatrix(grid, PATTERN4);

  console.log(result1);
  console.log(result2);
  console.log(result3);
  console.log(result4);

  console.log("#1#", result1.length);
  console.log("#2#", result2.length);
  console.log("#3#", result3.length);
  console.log("#4#", result4.length);

  console.log(
    "total",
    result1.length + result2.length + result3.length + result4.length
  );
}

main();
