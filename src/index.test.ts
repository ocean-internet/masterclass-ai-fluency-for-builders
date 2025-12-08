import "./index.test-setup";

import { readFileSync } from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("runCommand", () => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
    process.exit = exitSpy as never;
    vi.mocked(readFileSync).mockReturnValue("test content");
  });

  describe("error handling", () => {
    it("shows help for invalid command", async () => {
      const { runCommand } = await import("./index");

      try {
        await runCommand("invalid-command", []);
      } catch {
        // Expected to exit
      }

      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it("handles errors gracefully", async () => {
      const { runCommand } = await import("./index");
      const { generateAdr } = await import("./step01/generate-adr");

      vi.mocked(readFileSync).mockReturnValue("test context");
      vi.mocked(generateAdr).mockRejectedValueOnce(new Error("Test error"));

      await expect(runCommand("generate-01", ["test-context.md"])).rejects.toThrow("Test error");
    });
  });

  describe("routing", () => {
    it.each([
      ["generate-01", "ADR generated successfully!"],
      ["evaluate", "ADR evaluated successfully!"],
      ["generate-02", "ADR generated successfully!"],
    ])("routes %s to file output handler", async (command, expectedMessage) => {
      const { runCommand } = await import("./index");

      vi.mocked(readFileSync).mockReturnValue("test input");

      await runCommand(command, ["test-file.md"]);

      expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Filename:"));
    });

    it.each([
      ["context", ["test-file.md"], "test context"],
      ["options", ["test-file.json"], '{"description": "Test context", "drivers": ["Driver 1"]}'],
      [
        "render",
        ["test-file.json"],
        '{"title": "Test", "context": {"description": "Test", "drivers": ["Driver 1"]}, "options": [], "decision": {"chosenOption": "Option", "justification": "Test", "consequences": [{"impact": "Good", "consequence": "Good"}, {"impact": "Bad", "consequence": "Bad"}]}}',
      ],
    ])("routes %s to stdout handler", async (command, args, mockData) => {
      const { runCommand } = await import("./index");

      vi.mocked(readFileSync).mockReturnValue(mockData);

      await runCommand(command, args);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("routes decision to stdout handler", async () => {
      const { runCommand } = await import("./index");

      const contextJson = '{"description": "Test context", "drivers": ["Driver 1"]}';
      const optionsJson =
        '[{"uuid": "550e8400-e29b-41d4-a716-446655440000", "title": "Option 1", "description": "Desc", "arguments": [{"impact": "Good", "argument": "Good"}, {"impact": "Bad", "argument": "Bad"}]}]';

      vi.mocked(readFileSync).mockReturnValueOnce(contextJson).mockReturnValueOnce(optionsJson);

      await runCommand("decision", ["context.json", "options.json"]);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
