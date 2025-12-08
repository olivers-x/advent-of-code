# Compiler to use
CC = gcc

# Compiler flags
CFLAGS = -Wall -Wextra -std=c11

# Target executable
TARGET = part2

# Default rule to build the program
all: $(TARGET)

# Rule to compile the program
$(TARGET): part2-f.c
	$(CC) $(CFLAGS) -o $(TARGET) part2-f.c

# Rule to clean up compiled files
clean:
	rm -f $(TARGET)

# Rule to run the program with an argument passed to it
run: $(TARGET)
	@if [ -z "$(INPUT)" ]; then \
		echo "Error: Please provide an argument, e.g., make run INPUT=nameoffile.txt"; \
	else \
		./$(TARGET) $(INPUT); \
	fi