import { readFileSync } from "node:fs";

import { contextSchema } from "@step02/context/schema";
import { generateOptions } from "@step02/options/generate";

export async function handleOptions(contextJsonFile: string): Promise<string> {
  const contextJson = readFileSync(contextJsonFile, "utf-8");
  const context = contextSchema.parse(JSON.parse(contextJson));
  const options = await generateOptions(context);
  return JSON.stringify(options, null, 2);
}
