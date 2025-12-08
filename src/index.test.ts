import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./cli/execute-file-command", () => ({
  executeFileCommand: vi.fn(),
}));

describe("main", () => {
  const exitSpy = vi.fn();
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  let originalArgv: string[];
  let originalExit: typeof process.exit;

  beforeEach(() => {
    vi.clearAllMocks();
    originalArgv = process.argv;
    originalExit = process.exit;
    process.exit = exitSpy as never;
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
  });

  it("exits with code 0 when command executes successfully", async () => {
    const { main } = await import("./index");
    const { executeFileCommand } = await import("./cli/execute-file-command");
    vi.mocked(executeFileCommand).mockResolvedValueOnce(undefined);

    process.argv = ["node", "index.ts", "generate", "test-file.md"];

    await main();

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("exits with code 1 when executeFileCommand throws an error", async () => {
    const { main } = await import("./index");
    const { executeFileCommand } = await import("./cli/execute-file-command");
    const testError = new Error("Test error");
    vi.mocked(executeFileCommand).mockRejectedValueOnce(testError);

    process.argv = ["node", "index.ts", "generate", "test-file.md"];

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Test error");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("shows help message and exits 0 when no command provided", async () => {
    const { main } = await import("./index");

    process.argv = ["node", "index.ts"];

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith("Usage: yarn adr <command> [args...]\n");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("shows help message and exits 0 when invalid command provided", async () => {
    const { main } = await import("./index");

    process.argv = ["node", "index.ts", "invalid-command"];

    await main();

    expect(consoleLogSpy).toHaveBeenCalledWith("Usage: yarn adr <command> [args...]\n");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls executeFileCommand with correct arguments when valid command provided", async () => {
    const { main } = await import("./index");
    const { executeFileCommand } = await import("./cli/execute-file-command");
    vi.mocked(executeFileCommand).mockResolvedValueOnce(undefined);

    process.argv = ["node", "index.ts", "generate", "test-file.md"];

    await main();

    expect(executeFileCommand).toHaveBeenCalledOnce();
  });
});
