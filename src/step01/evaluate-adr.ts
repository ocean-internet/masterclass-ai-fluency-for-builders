// Note: This is demo/teaching code, not production code.
// Error handling is kept minimal to reduce noise and focus on core concepts.
import { readFileSync } from "node:fs";
import { basename } from "node:path";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { type AdrEval, adrEvalSchema } from "@step01/eval/schema.js";
import { extractTitle } from "@step01/shared/extract-title.js";
import { jsonToMarkdown } from "@step01/shared/json-to-markdown.js";
import { loadMadrTemplate } from "@step01/shared/load-madr-template.js";
import { loadPromptTemplate } from "@step01/shared/load-prompt-template.js";
import type z from "zod";

import { env } from "../env";
import { addMetadataToEval } from "./add-metadata-to-eval";
import { saveEval } from "./eval/save-eval";

const PROMPT_TEMPLATE_FILE = "eval-prompt.md";
const EVAL_TEMPLATE_FILE = "eval-template.md.hbs";
const MADR_TEMPLATE = "adr-template-minimal.md";

const llmSchema = adrEvalSchema.omit({ title: true, average: true });
export type LlmSchema = z.infer<typeof llmSchema>;

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , adrPath] = process.argv;
  if (!adrPath) {
    console.error(`Usage: yarn tsx ${process.argv[1]} <adr-markdown-file>`);
    process.exit(1);
  }

  const adr = readFileSync(adrPath, "utf-8");
  const adrFilename = basename(adrPath);

  Promise.resolve()
    .then(() => evaluateAdr(adr))
    .then((evalMarkdown) => saveEval(adrFilename, evalMarkdown))
    .then((evalFilename) => {
      console.log("ADR evaluated successfully!");
      console.log(`Filename: ${evalFilename}`);
    })
    .catch((error) => {
      console.error(error.message || "Error evaluating ADR");
      process.exit(1);
    });
}

export function evaluateAdr(madr: string): Promise<string> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL_JUDGE,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const promptTemplate = loadPromptTemplate(PROMPT_TEMPLATE_FILE);
  const title = extractTitle(madr) || "ADR";

  const chain = ChatPromptTemplate.fromTemplate(promptTemplate)
    .pipe(model.withStructuredOutput(llmSchema))
    .pipe(RunnableLambda.from((adrEval) => addMetadataToEval(adrEval, title)))
    .pipe(RunnableLambda.from((adrEval) => adrEvalSchema.parse(adrEval)))
    .pipe(RunnableLambda.from((adrEval) => jsonToMarkdown<AdrEval>(EVAL_TEMPLATE_FILE, adrEval)));

  const madrTemplate = loadMadrTemplate(MADR_TEMPLATE);

  return chain.invoke({ madrTemplate, madr });
}
