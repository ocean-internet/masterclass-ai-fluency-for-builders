import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { jsonToMarkdown } from "@shared/json-to-markdown";
import { loadPromptTemplate } from "@shared/load-prompt-template";
import z from "zod";

import { env } from "../../env";
import { type Context } from "../context/schema";
import { argumentSchema, type Option, optionSchema, transformArguments } from "../options/schema";
import { type Decision, decisionSchema } from "./schema";

const DECISION_CONTEXT_TEMPLATE = "decision-context.hbs";
const SYSTEM_PROMPT = "system.md";
const DECISION_PROMPT = "generate-decision.md";

const transformedOptionSchema = optionSchema
  .omit({ arguments: true })
  .extend({ arguments: z.array(argumentSchema).transform(transformArguments) });

type TransformOption = z.infer<typeof transformedOptionSchema>;

export function generateDecision(context: Context, options: Option[]): Promise<Decision> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const humanPrompt = loadPromptTemplate(DECISION_PROMPT);

  const transformedOptions = z.array(transformedOptionSchema).parse(options);

  const decisionContext = jsonToMarkdown<{ context: Context; options: TransformOption[] }>(DECISION_CONTEXT_TEMPLATE, {
    context,
    options: transformedOptions,
  });

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ])
    .pipe(model.withStructuredOutput(decisionSchema))
    .pipe((result) => decisionSchema.parse(result));

  return chain.invoke({ context: decisionContext });
}
