import { readFileSync } from "node:fs";

import type { SaveCommand } from "./types";

export async function executeSaveCommand(config: SaveCommand, input: string): Promise<void> {
  const content = readFileSync(input, "utf-8");
  const output = await config.handler(content);
  const filename = config.save({ input, output });
  console.log(config.successMessage);
  console.log(`Filename: ${filename}`);
}
