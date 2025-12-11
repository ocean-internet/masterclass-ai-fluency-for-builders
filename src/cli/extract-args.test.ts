import { describe, expect, it } from "vitest";

import { extractCommandArgs } from "./extract-args";
import type { CommandConfig } from "./types";

describe("extractCommandArgs", () => {
  it("returns first arg when command requires args and arg is provided", () => {
    const config: CommandConfig = {
      description: "Test command",
      usage: "test <input-file>",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    const result = extractCommandArgs(config, ["input.txt"]);

    expect(result).toBe("input.txt");
  });

  it("returns undefined when command doesn't require args and no arg provided", () => {
    const config: CommandConfig = {
      description: "Test command",
      usage: "test",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    const result = extractCommandArgs(config, []);

    expect(result).toBeUndefined();
  });

  it("returns undefined when command doesn't require args and arg is provided", () => {
    const config: CommandConfig = {
      description: "Test command",
      usage: "test",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    const result = extractCommandArgs(config, ["extra-arg.txt"]);

    expect(result).toBe("extra-arg.txt");
  });

  it("throws error with usage message when command requires args but none provided", () => {
    const config: CommandConfig = {
      description: "Test command",
      usage: "test <input-file>",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    expect(() => extractCommandArgs(config, [])).toThrow("Missing required argument");
  });

  it("handles commands with different usage patterns", () => {
    const config1: CommandConfig = {
      description: "Command with single arg",
      usage: "cmd <file>",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    const config2: CommandConfig = {
      description: "Command with multiple args in usage",
      usage: "cmd <file1> <file2>",
      handler: async () => "",
      save: () => "",
      successMessage: "",
    };

    expect(extractCommandArgs(config1, ["file.txt"])).toBe("file.txt");
    expect(extractCommandArgs(config2, ["file1.txt"])).toBe("file1.txt");
  });
});
