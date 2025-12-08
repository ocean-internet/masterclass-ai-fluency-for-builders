// Note: This is demo/teaching code, not production code.
// Error handling is kept minimal to reduce noise and focus on core concepts.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";

import { env } from "../env";
import { jsonToMarkdown } from "../shared/json-to-markdown";
import { loadPromptTemplate } from "../shared/load-prompt-template";
import { type Adr, adrSchema } from "./adr/schema";

const ADR_PROMPT = "generate-adr-minimal.md";
const ADR_TEMPLATE = "adr-minimal.hbs";

export function generateAdr(context: string): Promise<string> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const promptTemplate = loadPromptTemplate(ADR_PROMPT);

  const chain = ChatPromptTemplate.fromTemplate(promptTemplate)
    .pipe(model.withStructuredOutput(adrSchema))
    .pipe((adr) => adrSchema.parse(adr))
    .pipe(RunnableLambda.from((adr) => jsonToMarkdown<Adr>(ADR_TEMPLATE, adr)));

  return chain.invoke({ context });
}
