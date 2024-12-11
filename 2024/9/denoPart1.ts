import { readInput } from "./input.ts";

export type Disk = (number | null)[];

export function uncompress(disk: string) {
  const res: (number | null)[] = [];
  let id = 0;
  for (let i = 0; i < disk.length; i++) {
    if (i % 2 === 0) {
      for (let j = 0; j < Number(disk[i]); j++) {
        res.push(id);
      }
      id++;
    } else {
      for (let j = 0; j < Number(disk[i]); j++) {
        res.push(null);
      }
    }
  }

  return res;
}

function moveToStart(disk: Disk) {
  let l = 0;
  let r = disk.length - 1;
  while (l < r) {
    if (disk[l] !== null) {
      l++;
      continue;
    }

    if (disk[r] === null) {
      r--;
      continue;
    }

    disk[l] = disk[r];
    disk[r] = null;
    l++;
    r--;
  }

  return disk;
}

export function calculateChecksum(disk: Disk) {
  return disk.reduce((acc, val, currIndex) => {
    if (val === null) return acc;
    return acc! + val * currIndex;
  }, 0);
}

function part1(input: string) {
  const uncompressed = uncompress(input);
  const diskEncrypted = moveToStart(uncompressed);
  console.log(calculateChecksum(diskEncrypted));
}

if (import.meta.main) {
  part1(readInput().trimEnd());
}
