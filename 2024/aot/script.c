#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SIZE 100 // Define a maximum size for the map

char antinodeMap[MAX_SIZE][MAX_SIZE];
char charAntinode = '#';
int mapSize;
int count = 0;

void readFileLineByLine(const char *path, char lines[MAX_SIZE][MAX_SIZE]) {
    FILE *file = fopen(path, "r"); // Open file in read mode
    if (!file) {
        fprintf(stderr, "Cannot open file: %s\n", path);
        exit(1);
    }

    int i = 0;
    while (fgets(lines[i], MAX_SIZE, file) != NULL) {
        lines[i][strcspn(lines[i], "\n")] = 0; // Remove newline character
        i++;
    }

    fclose(file); // Don't forget to close the file
    mapSize = i; // Set mapSize to the number of lines read
}

void initAntinodeMap() {
    for (int i = 0; i < mapSize; i++) {
        for (int j = 0; j < mapSize; j++) {
            antinodeMap[i][j] = '.';
        }
    }
}

void placeIfOk(int x, int y) {
    if (x >= 0 && y >= 0 && x < mapSize && y < mapSize) {
        antinodeMap[x][y] = charAntinode;
    }
}

void placeAntinode(int aX, int aY, int bX, int bY) {
    int dx = aX - bX;
    int dy = aY - bY;

    placeIfOk(aX + dx, aY + dy);
    placeIfOk(bX - dx, bY - dy);
}

void placeAntinode2(int aX, int aY, int bX, int bY) {
    int dx = aX - bX;
    int dy = aY - bY;

    int x = aX + dx;
    int y = aY + dy;

    while (x < mapSize && y < mapSize) {
        placeIfOk(x, y);
        x += dx;
        y += dy;
    }

    x = bX - dx;
    y = bY - dy;

    while (x >= 0 && y >= 0) {
        placeIfOk(x, y);
        x -= dx;
        y -= dy;
    }
}

void goThroughLocations(int locations[][2], int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < i; j++) {
            if (i == j) continue;

            placeAntinode2(locations[i][0], locations[i][1], locations[j][0], locations[j][1]);
        }
    }
}

int getAntinodeCount() {
    count = 0;
    for (int i = 0; i < mapSize; i++) {
        for (int j = 0; j < mapSize; j++) {
            if (antinodeMap[i][j] != '.') count += 1;
        }
    }
    return count;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    char lines[MAX_SIZE][MAX_SIZE];
    readFileLineByLine(argv[1], lines);

    initAntinodeMap();

    int locations[MAX_SIZE][2];
    int locCount = 0;

    for (int i = 0; i < mapSize; i++) {
        for (int j = 0; j < strlen(lines[i]); j++) {
            char c = lines[i][j];
            if (c != '.') {
                locations[locCount][0] = i;
                locations[locCount][1] = j;
                locCount++;
            }
        }
    }

    goThroughLocations(locations, locCount);

    printf("%d\n", getAntinodeCount());

    return 0;
}

