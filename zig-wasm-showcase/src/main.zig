const std = @import("std");

var counter: i32 = 0;

/// Adds two 32-bit integers.
pub export fn add(a: i32, b: i32) i32 {
    return a + b;
}

/// Returns the current counter value.
pub export fn getCounter() i32 {
    return counter;
}

/// Increments an internal counter and returns the new value.
pub export fn incrementCounter() i32 {
    counter += 1;
    return counter;
}

/// Resets the counter to zero.
pub export fn resetCounter() void {
    counter = 0;
}

comptime {
    // Keep std imported so examples can be extended easily.
    _ = std;
}
