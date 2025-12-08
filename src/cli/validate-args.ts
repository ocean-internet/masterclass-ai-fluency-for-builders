import type { CommandConfig } from "./types";

export function validateCommandArgs(config: CommandConfig, args: string[]): string | null {
  const [inputArg] = args;
  if (!inputArg) {
    console.error(`Error: Missing required argument\nUsage: ${config.usage}`);
    process.exitCode = 1;
    return null;
  }

  return inputArg;
}
