import { commands } from "./commands";

export function showHelp() {
  console.log("Usage: yarn adr <command> [args...]\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(commands)) {
    console.log(`  ${name.padEnd(10)} ${cmd.description}`);
  }
}
