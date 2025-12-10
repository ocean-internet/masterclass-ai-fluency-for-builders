import { ShowHelpError } from "@cli/show-help";

import type { CommandConfig } from "./types";

export function validateCommandArgs(config: CommandConfig, args: string[]): string | undefined {
  const [inputArg] = args;

  const requiresArgs = config.usage.includes("<");

  if (!inputArg && requiresArgs) {
    console.error(`Error: Missing required argument`);
    throw ShowHelpError;
  }

  return inputArg;
}
