const std = @import("std");

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    var file = try std.fs.cwd().openFile("input.txt", .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();
    var buf: [1024]u8 = undefined;

    var numbers = std.ArrayList(u32).init(allocator);

    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var result = try std.fmt.parseInt(u32, line, 10);
        result = result / 3 - 2;
        try numbers.append(result);
    }

    var sum: u32 = 0;
    for (numbers.items) |number| {
        sum += number;
    }

    std.debug.print("Sum of all numbers: {d}\n", .{sum});

    numbers.deinit();
}
