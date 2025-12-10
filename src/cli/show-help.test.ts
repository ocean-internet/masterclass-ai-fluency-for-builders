import { beforeEach, describe, expect, it, vi } from "vitest";

import { commands } from "./commands";
import { showHelp, ShowHelpError } from "./show-help";

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

describe("ShowHelpError", () => {
  it("has correct name property", () => {
    const error = new ShowHelpError();
    expect(error.name).toBe("ShowHelpError");
  });

  it("can be instantiated with message", () => {
    const message = "Test error message";
    const error = new ShowHelpError(message);
    expect(error.message).toBe(message);
    expect(error.name).toBe("ShowHelpError");
  });

  it("can be instantiated without message", () => {
    const error = new ShowHelpError();
    expect(error.message).toBe("");
    expect(error.name).toBe("ShowHelpError");
  });
});
