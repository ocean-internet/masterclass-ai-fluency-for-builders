import type { PrintCommand } from "./types";

export async function executePrintCommand(config: PrintCommand, inputArg: string, args: string[]): Promise<void> {
  const handler = config.handler as (input: string, ...args: string[]) => Promise<string>;
  const output = await handler(inputArg, ...args.slice(1));
  console.log(output);
}
