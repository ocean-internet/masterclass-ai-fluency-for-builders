import { readFileSync } from "node:fs";

import type { CommandConfig } from "./types";

export async function executeFileCommand(
  config: Extract<CommandConfig, { outputToStdout?: false }>,
  input: string,
): Promise<void> {
  const content = readFileSync(input, "utf-8");
  const output = await config.handler(content);
  const filename = config.save({ input, output });
  console.log(config.successMessage);
  console.log(`Filename: ${filename}`);
}
