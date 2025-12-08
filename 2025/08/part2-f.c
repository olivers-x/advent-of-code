#include <stdio.h>
#include <stdlib.h>

#define MAX_N 1000
#define MAX_PAIRS (MAX_N * (MAX_N - 1) / 2)

static int X[MAX_N];
static int Y[MAX_N];
static int Z[MAX_N];

static int pairU[MAX_PAIRS];
static int pairV[MAX_PAIRS];
static double pairD[MAX_PAIRS];

static int heap[MAX_PAIRS];
static int parent[MAX_N];

void siftDown(int idx, int size) {
    int item = heap[idx];
    double weight = pairD[item];
    int half = size >> 1;

    while (idx < half) {
        int leftChild = (idx << 1) + 1;
        int rightChild = leftChild + 1;

        int bestChild = leftChild;
        double bestWeight = pairD[heap[leftChild]];

        if (rightChild < size) {
            double rightWeight = pairD[heap[rightChild]];
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

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    FILE *file = fopen(argv[argc - 1], "r");
    if (!file) {
        perror("Error opening file");
        return 1;
    }

    int N = 0;
    int x, y, z;


    while (fscanf(file, "%d,%d,%d", &x, &y, &z) == 3) {
        X[N] = x;
        Y[N] = y;
        Z[N] = z;
        N++;
    }
    fclose(file);

    int pairCount = 0;

    for (int i = 0; i < N; i++) {
        for (int j = i + 1; j < N; j++) {
            double dx = (double)(X[i] - X[j]);
            double dy = (double)(Y[i] - Y[j]);
            double dz = (double)(Z[i] - Z[j]);

            pairU[pairCount] = i;
            pairV[pairCount] = j;
            pairD[pairCount] = dx * dx + dy * dy + dz * dz;
            pairCount++;
        }
    }

    for (int i = 0; i < pairCount; i++) {
        heap[i] = i;
    }

    for (int i = (pairCount >> 1) - 1; i >= 0; i--) {
        siftDown(i, pairCount);
    }

    for (int i = 0; i < N; i++) {
        parent[i] = i;
    }

    int clusters = N;
    int heapSize = pairCount;

    while (heapSize > 0) {
        int idx = heap[0];
        heapSize--;
        heap[0] = heap[heapSize];
        siftDown(0, heapSize);

        int u = pairU[idx];
        int v = pairV[idx];


        int rootU = u;
        while (rootU != parent[rootU]) {
            parent[rootU] = parent[parent[rootU]];
            rootU = parent[rootU];
        }


        int rootV = v;
        while (rootV != parent[rootV]) {
            parent[rootV] = parent[parent[rootV]];
            rootV = parent[rootV];
        }

        if (rootU != rootV) {
            if (clusters == 2) {

                printf("%ld\n", (long)X[u] * X[v]);
                return 0;
            }
            parent[rootU] = rootV;
            clusters--;
        }
    }

    return 0;
}