// CLI entry point for all runnable commands.
// Usage: yarn adr <command> [args...]
// Commands: generate, generate-01, generate-02, context, options, decision, render, evaluate

import { commands } from "@cli/commands";
import { executePrintCommand } from "@cli/execute-print-command";
import { executeSaveCommand } from "@cli/execute-save-command";
import { handleError } from "@cli/handle-error";
import { showHelp } from "@cli/show-help";
import type { PrintCommand, SaveCommand } from "@cli/types";
import { validateCommandArgs } from "@cli/validate-args";

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

async function runCommand(command: string, args: string[]): Promise<void> {
  if (!command) return showHelp();

  const config = commands[command as keyof typeof commands];
  if (!config) return showHelp();

  const inputArg = validateCommandArgs(config, args);
  if (!inputArg) return showHelp();

  if ("save" in config) {
    await executeSaveCommand(config as SaveCommand, inputArg);
  } else {
    await executePrintCommand(config as PrintCommand, inputArg, args);
  }
}

export async function main(): Promise<void> {
  try {
    const [command, ...args] = process.argv.slice(2);
    await runCommand(command ?? "", args);
    process.exit(0);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}
