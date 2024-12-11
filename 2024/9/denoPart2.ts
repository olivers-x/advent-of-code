import { readInput } from "./input.ts";
import { calculateChecksum, uncompress, type Disk } from "./denoPart1.ts";
import { BinaryHeap, ascend } from "@std/data-structures";

function getCurrentBlockSize(disk: Disk, r: number) {
  let size = 0;
  const currId = disk[r];
  while (disk[r] === currId) {
    size++;
    r--;
  }

  return size;
}

function initFreeSpaces(disk: Disk): BinaryHeap<number>[] {
  const freeSpaces = Array.from(
    { length: 10 },
    () => new BinaryHeap<number>(ascend)
  );

  let idx = 0;
  while (idx < disk.length) {
    if (disk[idx] !== null) {
      idx++;
      continue;
    }

    let size = 0;
    while (disk[idx] === null) {
      size++;
      idx++;
    }

    freeSpaces[size].push(idx - size);
  }

  return freeSpaces;
}

function moveBlocksToStart(disk: Disk) {
  let r = disk.length - 1;
  const freeSpaces = initFreeSpaces(disk);
  while (r > 0) {
    if (disk[r] === null) {
      r--;
      continue;
    }

    const currentBlockSize = getCurrentBlockSize(disk, r);

    const indexOfFreeSpace = findFreeSpaceOfSize(
      currentBlockSize,
      r,
      freeSpaces
    );

    if (!indexOfFreeSpace) {
      const currNum = disk[r];
      while (disk[r] === currNum) {
        r--;
      }
      continue;
    }

    for (let i = 0; i < currentBlockSize; i++) {
      disk[indexOfFreeSpace + i] = disk[r];
      disk[r] = null;
      r--;
    }
  }

  return disk;
}

function part2(input: string) {
  const uncompressed = uncompress(input);
  const fragmentedDisk = moveBlocksToStart(uncompressed);
  console.log(calculateChecksum(fragmentedDisk));
}

if (import.meta.main) {
  part2(readInput().trimEnd());
}

function findFreeSpaceOfSize(
  size: number,
  r: number,
  freeSpaces: BinaryHeap<number>[]
) {
  const candidateIdxs: { size: number; idx: number }[] = [];
  for (let i = size; i < 10; i++) {
    const earliestFreeSpace = freeSpaces[i].peek();
    if (earliestFreeSpace && earliestFreeSpace < r) {
      candidateIdxs.push({ size: i, idx: earliestFreeSpace });
    }
  }

  if (!candidateIdxs.length) {
    return null;
  }

  const { idx, size: currSize } = candidateIdxs.toSorted(
    (a, b) => a.idx - b.idx
  )[0];

  freeSpaces[currSize].pop();

  if (currSize - size > 0) {
    freeSpaces[currSize - size].push(idx + size);
  }

  return idx;
}
