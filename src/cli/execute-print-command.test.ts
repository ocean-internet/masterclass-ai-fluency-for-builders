import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { executePrintCommand } from "./execute-print-command";
import type { PrintCommand } from "./types";

describe("executePrintCommand", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  const mockHandler = vi.fn();

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("calls handler with correct arguments and logs output", async () => {
    const mockOutput = "Test output";
    mockHandler.mockResolvedValue(mockOutput);

    const config: PrintCommand = {
      description: "Test command",
      usage: "test <input> [args...]",
      handler: mockHandler,
    };

    await executePrintCommand(config, "input-file.md", ["input-file.md", "arg1", "arg2"]);

    expect(mockHandler).toHaveBeenCalledWith("input-file.md", "arg1", "arg2");
    expect(consoleLogSpy).toHaveBeenCalledWith(mockOutput);
  });

  it("calls handler with only input when no additional args", async () => {
    const mockOutput = "Test output";
    mockHandler.mockResolvedValue(mockOutput);

    const config: PrintCommand = {
      description: "Test command",
      usage: "test <input>",
      handler: mockHandler,
    };

    await executePrintCommand(config, "input-file.md", ["input-file.md"]);

    expect(mockHandler).toHaveBeenCalledWith("input-file.md");
    expect(consoleLogSpy).toHaveBeenCalledWith(mockOutput);
  });
});
