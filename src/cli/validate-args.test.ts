import { beforeEach, describe, expect, it, vi } from "vitest";

import { commands } from "./commands";
import { validateCommandArgs } from "./validate-args";

describe("validateCommandArgs", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it.each((Object.keys(commands) as Array<keyof typeof commands>).map((key) => [key, commands[key]]))(
    "shows error when %s called without arguments",
    (_commandName, config) => {
      const result = validateCommandArgs(config, []);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Error: Missing required argument"));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(`Usage: ${config.usage}`));
      expect(process.exitCode).toBe(1);
      expect(result).toBeNull();
    },
  );

  it("returns input argument when valid argument provided", () => {
    const config = commands.generate;
    const result = validateCommandArgs(config, ["test-file.md"]);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
    expect(result).toBe("test-file.md");
  });
});
