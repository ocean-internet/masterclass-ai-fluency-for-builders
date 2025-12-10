import { readFileSync } from "node:fs";

import { FIXTURES_DIR } from "@test-utils/config";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { executeSaveCommand } from "./execute-save-command";
import type { SaveCommand } from "./types";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    writeFileSync: vi.fn(),
  };
});

describe("executeSaveCommand", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  const mockHandler = vi.fn();
  const mockSave = vi.fn();

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("reads file, calls handler, calls save, and logs success message and filename", async () => {
    const inputFile = join(FIXTURES_DIR, "example-context.md");
    const mockOutput = "Test output";
    const mockFilename = "/test/output/file.md";

    mockHandler.mockResolvedValue(mockOutput);
    mockSave.mockReturnValue(mockFilename);

    const config: SaveCommand = {
      description: "Test command",
      usage: "test <input>",
      handler: mockHandler,
      save: mockSave,
      successMessage: "Success!",
    };

    await executeSaveCommand(config, inputFile);

    const fileContent = readFileSync(inputFile, "utf-8");
    expect(mockHandler).toHaveBeenCalledWith(fileContent);
    expect(mockSave).toHaveBeenCalledWith({ input: inputFile, output: mockOutput });
    expect(consoleLogSpy).toHaveBeenCalledWith("Success!");
    expect(consoleLogSpy).toHaveBeenCalledWith(`Filename: ${mockFilename}`);
  });
});
