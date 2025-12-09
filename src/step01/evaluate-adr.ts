// Note: This is demo/teaching code, not production code.
// Error handling is kept minimal to reduce noise and focus on core concepts.

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { extractTitle } from "@shared/extract-title";
import { jsonToMarkdown } from "@shared/json-to-markdown";
import { loadMadrTemplate } from "@shared/load-madr-template";
import { loadPromptTemplate } from "@shared/load-prompt-template";
import { type AdrEval, adrEvalSchema } from "@step01/eval/schema";
import z from "zod";

import { env } from "../env";
import { addMetadataToEval } from "./eval/add-metadata-to-eval";

const EVAL_PROMPT = "eval-adr.md";
const EVAL_TEMPLATE = "adr-eval.hbs";
const MADR_TEMPLATE = "adr-template-minimal.md";

const llmSchema = adrEvalSchema.omit({ title: true, average: true });
export type LlmSchema = z.infer<typeof llmSchema>;

export function evaluateAdr(madr: string): Promise<string> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL_JUDGE,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const promptTemplate = loadPromptTemplate(EVAL_PROMPT);
  const title = extractTitle(madr);

  const chain = ChatPromptTemplate.fromTemplate(promptTemplate)
    .pipe(model.withStructuredOutput(llmSchema))
    .pipe(RunnableLambda.from((adrEval) => addMetadataToEval(adrEval, title)))
    .pipe(RunnableLambda.from((adrEval) => adrEvalSchema.parse(adrEval)))
    .pipe(RunnableLambda.from((adrEval) => jsonToMarkdown<AdrEval>(EVAL_TEMPLATE, adrEval)));

  const madrTemplate = loadMadrTemplate(MADR_TEMPLATE);

  return chain.invoke({ madrTemplate, madr });
}
