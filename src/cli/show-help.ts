import { commands } from "./commands";

export class ShowHelpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ShowHelpError";
  }
}

export function showHelp() {
  console.log("Usage: yarn adr <command> [args...]\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(commands)) {
    console.log(`  ${name.padEnd(20)} ${cmd.usage.padEnd(50)} ${cmd.description}`);
  }
}
