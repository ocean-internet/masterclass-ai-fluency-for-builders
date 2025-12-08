import "../index.test-setup";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { showHelpAndExit } from "./show-help";

describe("showHelp", () => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const exitSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.exit = exitSpy as never;
  });

  it("displays help message and exits", () => {
    try {
      showHelpAndExit();
    } catch {
      // Expected to exit
    }

    expect(consoleLogSpy).toHaveBeenCalledWith("Usage: yarn adr <command> [args...]\n");
    expect(consoleLogSpy).toHaveBeenCalledWith("Commands:");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("lists all commands", () => {
    try {
      showHelpAndExit();
    } catch {
      // Expected to exit
    }

    const output = consoleLogSpy.mock.calls.flat().join("\n");
    expect(output).toContain("generate-01");
    expect(output).toContain("evaluate");
    expect(output).toContain("generate-02");
    expect(output).toContain("context");
    expect(output).toContain("options");
    expect(output).toContain("decision");
    expect(output).toContain("render");
  });
});
