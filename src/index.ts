// CLI entry point for all runnable commands.
// Usage: yarn adr <command> [args...]
// Commands: generate, generate-01, generate-02, context, options, decision, render, evaluate, vectorstore:build, vectorstore:status, vectorstore:delete

import { commands } from "@cli/commands";
import { executePrintCommand } from "@cli/execute-print-command";
import { executeSaveCommand } from "@cli/execute-save-command";
import { extractCommandArgs } from "@cli/extract-args";
import { handleError } from "@cli/handle-error";
import { showHelp, ShowHelpError } from "@cli/show-help";
import type { PrintCommand, SaveCommand } from "@cli/types";

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

async function runCommand(command: string, args: string[]): Promise<void> {
  if (!command) throw new ShowHelpError();

  const config = commands[command as keyof typeof commands];
  if (!config) throw new ShowHelpError();

  const inputArg = extractCommandArgs(config, args);

  if ("save" in config) {
    await executeSaveCommand(config as SaveCommand, inputArg ?? "");
  } else {
    await executePrintCommand(config as PrintCommand, inputArg ?? "", args);
  }
}

export async function main(): Promise<void> {
  try {
    const [command, ...args] = process.argv.slice(2);
    await runCommand(command ?? "", args);
    process.exit(0);
  } catch (error) {
    if (error instanceof ShowHelpError) {
      showHelp();
      process.exit(0);
    } else {
      handleError(error);
      process.exit(1);
    }
  }
}
