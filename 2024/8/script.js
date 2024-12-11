// const fs = require("fs");

import { readFileSync } from "fs";

const sum = (a, b) => a + b;

let mapSize;
let antinodeMap;
let char = "#";
let count = 0;

function readFileLineByLine(filePath) {
  return readFileSync(filePath, { encoding: "utf-8", flag: "r" }).split("\n");
}

function getLocations(map) {
  const locations = {};
  const size = map.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const char = map[i][j];
      if (char !== ".") {
        if (!locations[char]) {
          locations[char] = [];
        } else {
          // at least a pair of antennas
          antinodeMap[i][j] = char;
          const [{ x, y }] = locations[char];
          antinodeMap[x][y] = char;
        }
        locations[char].push({ x: i, y: j });
      }
    }
  }

  return locations;
}

function initAntinodeMap() {
  antinodeMap = Array(mapSize)
    .fill()
    .map(() => Array(mapSize).fill("."));
}

function getAntinodeCount() {
  for (let i = 0; i < mapSize; i++)
    for (let j = 0; j < mapSize; j++) {
      if (antinodeMap[i][j] !== ".") count += 1;
    }

  return count;
}

function placeIfOk(x, y) {
  if (!(x < 0 || y < 0 || x > mapSize - 1 || y > mapSize - 1)) {
    antinodeMap[x][y] = char;
  }
}

function placeAntinode(a, b) {
  // b > a

  let dx = a.x - b.x;
  let dy = a.y - b.y;

  placeIfOk(a.x + dx, a.y + dy);
  placeIfOk(b.x - dx, b.y - dy);
}

function placeAntinode2(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;

  let x = a.x + dx;
  let y = a.y + dy;

  while (x < mapSize && y < mapSize) {
    placeIfOk(x, y);
    x += dx;
    y += dy;
  }

  x = b.x - dx;
  y = b.y - dy;

  while (x >= 0 && y >= 0) {
    placeIfOk(x, y);
    x -= dx;
    y -= dy;
  }
}

function goThrouLocations(locations) {
  // for each two points place two antinodes
  const size = locations.length;

  for (let i = 0; i < size; i++)
    for (let j = 0; j < i; j++) {
      if (i === j) continue;

      const a = locations[i];
      const b = locations[j];

      placeAntinode2(a, b);
    }
}

function main() {
  const fileName = process.argv[process.argv.length - 1];

  const map = readFileLineByLine(fileName);
  mapSize = map.length;

  initAntinodeMap();

  const locations = getLocations(map);

  Object.values(locations).forEach(goThrouLocations);

  console.log(getAntinodeCount());
}

main();
