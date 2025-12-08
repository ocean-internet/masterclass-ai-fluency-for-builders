import { readFileSync } from "node:fs";

import type { CommandConfig } from "./types";

export async function executeFileCommand(
  config: Extract<CommandConfig, { outputToStdout?: false }>,
  inputArg: string,
): Promise<void> {
  const input = readFileSync(inputArg, "utf-8");
  const output = await config.handler(input);
  const filename = config.save(inputArg, output);
  console.log(config.successMessage);
  console.log(`Filename: ${filename}`);
}
