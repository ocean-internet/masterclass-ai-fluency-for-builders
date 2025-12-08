import { readFileSync } from "node:fs";

import { jsonToMarkdown } from "../shared/json-to-markdown";
import { generateContext } from "../step02/context/generate";

export async function handleContext(contextFile: string): Promise<string> {
  const context = readFileSync(contextFile, "utf-8");
  const result = await generateContext(context);
  return jsonToMarkdown("context.partial.hbs", result);
}
