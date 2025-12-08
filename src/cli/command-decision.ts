import { readFileSync } from "node:fs";

import * as z from "zod";

import { contextSchema } from "../step02/context/schema";
import { generateDecision } from "../step02/decision/generate";
import { optionSchema } from "../step02/options/schema";

export async function handleDecision(contextJsonFile: string, optionsJsonFile: string): Promise<string> {
  const contextJson = readFileSync(contextJsonFile, "utf-8");
  const optionsJson = readFileSync(optionsJsonFile, "utf-8");
  const context = contextSchema.parse(JSON.parse(contextJson));
  const options = z.array(optionSchema).parse(JSON.parse(optionsJson));
  const decision = await generateDecision(context, options);
  return JSON.stringify(decision, null, 2);
}
