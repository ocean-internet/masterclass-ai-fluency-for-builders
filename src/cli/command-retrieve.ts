import { readFileSync } from "node:fs";

import { contextSchema } from "@step02/context/schema";

import { retrieveContext } from "../step03/retrieval/retrieve-context";

export async function handleRetrieve(contextJsonFile: string): Promise<string> {
  const contextJson = readFileSync(contextJsonFile, "utf-8");
  const context = contextSchema.parse(JSON.parse(contextJson));

  const query = `Description: ${context.description}\nDecision drivers:\n${context.drivers.join("\n")}`;

  return retrieveContext(query);
}
