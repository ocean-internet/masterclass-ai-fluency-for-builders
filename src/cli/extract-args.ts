import { ShowHelpError } from "@cli/show-help";

import type { CommandConfig } from "./types";

export function extractCommandArgs(config: CommandConfig, args: string[]): string | undefined {
  const [inputArg] = args;

  const requiresArgs = config.usage.includes("<");

  if (!inputArg && requiresArgs) {
    throw new ShowHelpError(`Missing required argument`);
  }

  return inputArg;
}
