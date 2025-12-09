import { beforeEach, describe, expect, it, vi } from "vitest";

import { commands } from "./commands";
import { showHelp } from "./show-help";

describe("showHelp", () => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const exitSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.exit = exitSpy as never;
  });

  it("displays usage message with command syntax", () => {
    showHelp();
    const output = consoleLogSpy.mock.calls.flat().join("\n");
    expect(output).toContain("sage: yarn adr <command> [args...]");
    expect(output).toContain("Commands:");
  });

  it("lists all commands", () => {
    showHelp();

    const output = consoleLogSpy.mock.calls.flat().join("\n");
    Object.keys(commands).forEach((command) => expect(output).toContain(command));
  });
});
