import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { loadPromptTemplate } from "@shared/load-prompt-template";

import { env } from "../../env";
import { type Context, contextSchema } from "./schema";

const SYSTEM_PROMPT = "system.md";
const ADR_PROMPT = "generate-context.md";

export function generateContext(context: string): Promise<Context> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const promptTemplate = loadPromptTemplate(ADR_PROMPT);

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", promptTemplate],
  ])
    .pipe(model.withStructuredOutput(contextSchema))
    .pipe((result) => contextSchema.parse(result));

  return chain.invoke({ context });
}
