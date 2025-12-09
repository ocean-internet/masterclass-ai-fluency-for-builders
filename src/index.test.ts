import { executeSaveCommand } from "@cli/execute-save-command";
import { handleError } from "@cli/handle-error";
import { showHelp } from "@cli/show-help";
import { validateCommandArgs } from "@cli/validate-args";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { main } from "./index";

vi.mock("./cli/show-help");
vi.mock("./cli/validate-args");
vi.mock("./cli/execute-save-command");
vi.mock("./cli/handle-error");

describe("main", () => {
  const exitSpy = vi.fn();
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.clearAllMocks();
    originalArgv = process.argv;
    originalExit = process.exit;
    process.exit = exitSpy as never;
    vi.mocked(showHelp).mockReturnValue(undefined);
    vi.mocked(validateCommandArgs).mockReturnValue("test-file.md");
    vi.mocked(executeSaveCommand).mockResolvedValue(undefined);
    vi.mocked(handleError).mockReturnValue(undefined);
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("calls showHelp when command is missing", async () => {
    process.argv = ["node", "index.ts"];

    await main();

    expect(showHelp).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls showHelp when command is invalid", async () => {
    process.argv = ["node", "index.ts", "invalid-command"];

    await main();

    expect(showHelp).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls showHelp when args are invalid", async () => {
    process.argv = ["node", "index.ts", "generate"];
    vi.mocked(validateCommandArgs).mockReturnValue(null);

    await main();

    expect(validateCommandArgs).toHaveBeenCalled();
    expect(showHelp).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls executeSaveCommand for generate command", async () => {
    process.argv = ["node", "index.ts", "generate", "test-file.md"];

    await main();

    expect(validateCommandArgs).toHaveBeenCalled();
    expect(executeSaveCommand).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls handleError and exits with 1 when error occurs", async () => {
    process.argv = ["node", "index.ts", "generate", "test-file.md"];
    const testError = new Error("Test error");
    vi.mocked(executeSaveCommand).mockRejectedValue(testError);

    await main();

    expect(handleError).toHaveBeenCalledWith(testError);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
