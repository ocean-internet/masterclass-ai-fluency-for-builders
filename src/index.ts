// CLI entry point for all runnable commands.
// Usage: yarn adr <command> [args...]
// Commands: generate, evaluate

import { commands } from "./cli/commands";
import { executeFileCommand } from "./cli/execute-file-command";
import { handleError } from "./cli/handle-error";
import { showHelp } from "./cli/show-help";
import { validateCommandArgs } from "./cli/validate-args";

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

async function runCommand(command: string, args: string[]): Promise<void> {
  if (!command) return showHelp();

  const config = commands[command as keyof typeof commands];
  if (!config) return showHelp();

  const inputArg = validateCommandArgs(config, args);
  if (!inputArg) return;

  await executeFileCommand(config as Extract<typeof config, { outputToStdout?: false }>, inputArg);
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
