// CLI entry point for all runnable commands.
// Usage: yarn adr <command> [args...]
// Commands: generate (alias), generate-01, generate-02, context, options, decision, render, evaluate
// See docs/STEP_01_SINGLE_PROMPT.md and docs/STEP_02_SEQUENTIAL_CHAIN.md for usage examples.

import { commands } from "./cli/commands";
import { executeFileCommand } from "./cli/execute-file-command";
import { executeStdoutCommand } from "./cli/execute-stdout-command";
import { handleError } from "./cli/handle-error";
import { showHelpAndExit } from "./cli/show-help";
import { validateCommandArgs } from "./cli/validate-args";

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export async function runCommand(command: string, args: string[]): Promise<void> {
  if (!command) showHelpAndExit();

  const config = commands[command as keyof typeof commands];
  if (!config) showHelpAndExit();

  const inputArg = validateCommandArgs(config, args);
  if (!inputArg) return;

  if ("outputToStdout" in config && config.outputToStdout) {
    await executeStdoutCommand(config as Extract<typeof config, { outputToStdout: true }>, inputArg, args);
  } else {
    await executeFileCommand(config as Extract<typeof config, { outputToStdout?: false }>, inputArg);
  }
}

async function main(): Promise<void> {
  try {
    const [command, ...args] = process.argv.slice(2);
    await runCommand(command ?? "", args);
    process.exit(0);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}
