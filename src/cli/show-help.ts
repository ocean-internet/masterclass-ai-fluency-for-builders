import { commands } from "./commands";

export function showHelpAndExit(): never {
  console.log("Usage: yarn adr <command> [args...]\n");
  console.log("Commands:");
  for (const [name, cmd] of Object.entries(commands)) {
    console.log(`  ${name.padEnd(20)} ${cmd.description}`);
    console.log(`  ${"".padEnd(20)} Usage: ${cmd.usage}`);
  }
  process.exit(0);
}
