import { readFileSync } from 'fs';

function read() {
  const fileName = process.argv[process.argv.length - 1];
  return readFileSync(fileName, { encoding: 'utf-8', flag: 'r' }).trimEnd();
}

function part2() {
  /// Parsing input
  const lines = read().split('\n');
  const N = lines.length;

  const X = new Int32Array(N);
  const Y = new Int32Array(N);
  const Z = new Int32Array(N);

  for (let i = 0; i < N; i++) {
    const parts = lines[i].split(',');
    X[i] = parseInt(parts[0], 10);
    Y[i] = parseInt(parts[1], 10);
    Z[i] = parseInt(parts[2], 10);
  }

  /// Pairs
  const pairCount = (N * (N - 1)) / 2;

  const pairU = new Uint32Array(pairCount);
  const pairV = new Uint32Array(pairCount);
  const pairD = new Float64Array(pairCount);

  let ptr = 0;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = X[i] - X[j];
      const dy = Y[i] - Y[j];
      const dz = Z[i] - Z[j];

      pairU[ptr] = i;
      pairV[ptr] = j;
      pairD[ptr] = dx * dx + dy * dy + dz * dz;
      ptr++;
    }
  }

  const heap = new Int32Array(pairCount);
  for (let i = 0; i < pairCount; i++) heap[i] = i;

  // https://www.maxgcoding.com/another-look-at-heapifying
  // https://webdocs.cs.ualberta.ca/~holte/T26/heap-sift-down.html
  function siftDown(idx, size) {
    const item = heap[idx];
    const weight = pairD[item];
    const half = size >>> 1;

    while (idx < half) {
      let leftChild = (idx << 1) + 1;
      let rightChild = leftChild + 1;

      let bestChild = leftChild;
      let bestWeight = pairD[heap[leftChild]];

      if (rightChild < size) {
        const rightWeight = pairD[heap[rightChild]];
        if (rightWeight < bestWeight) {
          bestChild = rightChild;
          bestWeight = rightWeight;
        }
      }

      if (weight <= bestWeight) break;

      heap[idx] = heap[bestChild];
      idx = bestChild;
    }
    heap[idx] = item;
  }

  for (let i = (pairCount >>> 1) - 1; i >= 0; i--) {
    siftDown(i, pairCount);
  }

  // Union find - disjoint set
  const parent = new Int32Array(N);
  for (let i = 0; i < N; i++) parent[i] = i;

  let clusters = N;
  let heapSize = pairCount;

  while (heapSize > 0) {
    const idx = heap[0];
    heapSize--;
    heap[0] = heap[heapSize];
    siftDown(0, heapSize);

    const u = pairU[idx];
    const v = pairV[idx];

    let rootU = u;
    while (rootU !== parent[rootU]) {
      parent[rootU] = parent[parent[rootU]];
      rootU = parent[rootU];
    }

    let rootV = v;
    while (rootV !== parent[rootV]) {
      parent[rootV] = parent[parent[rootV]];
      rootV = parent[rootV];
    }

    if (rootU !== rootV) {
      if (clusters === 2) {
        console.log(X[u] * X[v]);
        return;
      }
      parent[rootU] = rootV;
      clusters--;
    }
  }
}

part2();
