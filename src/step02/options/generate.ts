import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { jsonToMarkdown } from "@shared/json-to-markdown";
import { loadPromptTemplate } from "@shared/load-prompt-template";
import * as z from "zod";

import { env } from "../../env";
import { type Context } from "../context/schema";
import { type Option, optionSchema } from "./schema";

const SYSTEM_PROMPT = "system.md";
const OPTIONS_PROMPT = "generate-options.md";

const llmOptionsSchema = z.object({
  options: z
    .array(optionSchema.omit({ uuid: true }))
    .min(2)
    .max(5),
});

export function generateOptions(data: Context): Promise<Option[]> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const humanPrompt = loadPromptTemplate(OPTIONS_PROMPT);

  const context = jsonToMarkdown<Context>("context.partial.hbs", data);

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ])
    .pipe(model.withStructuredOutput(llmOptionsSchema))
    .pipe((result) => z.array(optionSchema).parse(result.options));

  return chain.invoke({ context });
}
