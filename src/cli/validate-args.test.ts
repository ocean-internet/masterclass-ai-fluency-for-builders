import { ShowHelpError } from "@cli/show-help";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { commands } from "./commands";
import { validateCommandArgs } from "./validate-args";

describe("validateCommandArgs", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it.each(
    (Object.entries(commands) as Array<[string, (typeof commands)[keyof typeof commands]]>).filter(([, config]) =>
      config.usage.includes("<"),
    ),
  )("shows error when %s called without arguments", (_commandName, config) => {
    let thrownError: unknown;
    try {
      validateCommandArgs(config, []);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBe(ShowHelpError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Error: Missing required argument"));
  });

  it.each(
    (Object.entries(commands) as Array<[string, (typeof commands)[keyof typeof commands]]>).filter(
      ([, config]) => !config.usage.includes("<"),
    ),
  )("allows %s to be called without arguments", (_commandName, config) => {
    const result = validateCommandArgs(config, []);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
    expect(result).toBeUndefined();
  });

  it("returns input argument when valid argument provided", () => {
    const config = commands.generate;
    const result = validateCommandArgs(config, ["test-file.md"]);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
    expect(result).toBe("test-file.md");
  });
});
