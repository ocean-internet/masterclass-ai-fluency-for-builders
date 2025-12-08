import "../index.test-setup";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { commands } from "./commands";
import { validateCommandArgs } from "./validate-args";

describe("validateCommandArgs", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it.each([
    ["generate-01", commands["generate-01"]],
    ["evaluate", commands.evaluate],
    ["generate-02", commands["generate-02"]],
    ["context", commands.context],
    ["options", commands.options],
    ["render", commands.render],
  ])("shows error when %s called without arguments", (commandName, config) => {
    const result = validateCommandArgs(config, []);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Error: Missing required argument"));
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(`Usage: ${config.usage}`));
    expect(process.exitCode).toBe(1);
    expect(result).toBeNull();
  });

  it("returns input argument when provided", () => {
    const config = commands["generate-01"];
    const result = validateCommandArgs(config, ["test-file.md"]);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
    expect(result).toBe("test-file.md");
  });
});
