// Note: This is demo/teaching code, not production code.
// Error handling is kept minimal to reduce noise and focus on core concepts.
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { jsonToMarkdown } from "@step01/shared/json-to-markdown";
import { loadPromptTemplate } from "@step01/shared/load-prompt-template";
import { readFileSync } from "fs";

import { env } from "../env";
import { saveAdr } from "./adr/save-adr";
import { type Adr, adrSchema } from "./adr/schema";

const SYSTEM_PROMPT = "system-prompt.md";
const PROMPT_TEMPLATE_FILE = "adr-prompt.md";
const ADR_TEMPLATE_FILE = "adr-template.md.hbs";

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , contextPath] = process.argv;
  if (!contextPath) {
    console.error(`Usage: yarn tsx ${process.argv[1]} <problem-statement-file>`);
    process.exit(1);
  }

  const context = readFileSync(contextPath, "utf-8");

  Promise.resolve()
    .then(() => generateAdr(context))
    .then((adrMarkdown) => saveAdr(adrMarkdown))
    .then((adrFilename) => {
      console.log("ADR generated successfully!");
      console.log(`Filename: ${adrFilename}`);
    })
    .catch((error) => {
      console.error(error.message || "Error generating ADR");
      process.exit(1);
    });
}

export function generateAdr(context: string): Promise<string> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const promptTemplate = loadPromptTemplate(PROMPT_TEMPLATE_FILE);

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", promptTemplate],
  ])
    .pipe(model.withStructuredOutput(adrSchema))
    .pipe((adr) => adrSchema.parse(adr))
    .pipe(RunnableLambda.from((adr) => jsonToMarkdown<Adr>(ADR_TEMPLATE_FILE, adr)));

  return chain.invoke({ context });
}
