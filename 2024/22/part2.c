#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define SIZE 19 * 19 * 19 * 19

uint32_t prices[SIZE] = {0};

uint32_t key(int16_t d, int16_t c, int16_t b, int16_t a) {
    return (a + 9) * 19 * 19 * 19 + (b + 9) * 19 * 19 + (c + 9) * 19 + (d + 9);
}

uint32_t transformNumber(uint32_t n) {
    uint32_t r1 = ((n << 6) ^ n) & 16777215;
    uint32_t r2 = (r1 >> 5) ^ r1;
    uint32_t r3 = ((r2 << 11) ^ r2) & 16777215;
    return r3;
}

void part2(char *input) {
    char *line;
    uint32_t max = 0;

    line = strtok(input, "\n");
    while (line != NULL) {
        uint8_t visited[SIZE] = {0};
        uint32_t r = atoi(line);
        int16_t p0 = 0, p1 = 0, p2 = 0, p3 = 0, price = 0;
        int16_t dp0, dp1, dp2, dp3;

        for (int i = 0; i < 2001; i++) {
            p0 = p1;
            p1 = p2;
            p2 = p3;
            p3 = price;
            price = r % 10;

            r = transformNumber(r);

            if (i > 3) {
                dp0 = p1 - p0;
                dp1 = p2 - p1;
                dp2 = p3 - p2;
                dp3 = price - p3;

                int32_t k = key(dp0, dp1, dp2, dp3);

                if (!visited[k]) {
                    uint32_t priceAtK = prices[k];
                    uint32_t newPrice = priceAtK + price;
                    prices[k] = newPrice;
                    visited[k] = 1;

                    if (newPrice > max) {
                        max = newPrice;
                    }
                }
            }
        }
        line = strtok(NULL, "\n");
    }

    printf("%d\n", max);
}

char* read(int argc, char *argv[]) {
    FILE *file;
    long length;
    char *buffer;

    file = fopen(argv[argc - 1], "rb");
    if (file) {
        fseek(file, 0, SEEK_END);
        length = ftell(file);
        fseek(file, 0, SEEK_SET);
        buffer = malloc(length + 1);
        fread(buffer, 1, length, file);
        fclose(file);
        buffer[length] = '\0';
        return buffer;
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    char *input = read(argc, argv);
    if (input) {
        part2(input);
        free(input);
    }
    return 0;
}

