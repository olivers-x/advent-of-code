# Compiler to use
CC = gcc

# Compiler flags
CFLAGS = -Wall -Wextra -std=c11

# Target executable
TARGET = part2

# Default rule to build the program
all: $(TARGET)

# Rule to compile the program
$(TARGET): part2.c
	$(CC) $(CFLAGS) -o $(TARGET) part2.c

# Rule to clean up compiled files
clean:
	rm -f $(TARGET)

# Rule to run the program
run: $(TARGET)
	./$(TARGET)