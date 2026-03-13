const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    const optimize = b.standardOptimizeOption(.{});
    const root_module = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const wasm = b.addExecutable(.{
        .name = "demo",
        .root_module = root_module,
    });

    wasm.entry = .disabled;
    wasm.rdynamic = true; // export all pub export functions

    const install_dist = b.addInstallArtifact(wasm, .{
        .dest_dir = .{ .override = .{ .custom = "dist" } },
    });

    const install_try = b.addInstallArtifact(wasm, .{
        .dest_dir = .{ .override = .{ .custom = "try" } },
    });

    const wasm_step = b.step("wasm", "Build WebAssembly artifact into zig-out/dist");
    wasm_step.dependOn(&install_dist.step);

    const wasm_try_step = b.step("wasm-try", "Build WebAssembly artifact into zig-out/try for static publishing");
    wasm_try_step.dependOn(&install_try.step);
}
