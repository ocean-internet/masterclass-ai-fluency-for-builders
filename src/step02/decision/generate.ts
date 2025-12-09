import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { jsonToMarkdown } from "@shared/json-to-markdown";
import { loadPromptTemplate } from "@shared/load-prompt-template";

import { env } from "../../env";
import { type Context } from "../context/schema";
import { type Option, transformArguments } from "../options/schema";
import { type Decision, decisionSchema } from "./schema";

const SYSTEM_PROMPT = "system.md";
const DECISION_PROMPT = "generate-decision.md";

export function generateDecision(context: Context, options: Option[]): Promise<Decision> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const humanPrompt = loadPromptTemplate(DECISION_PROMPT);

  const transformedOptions = options.map((option) => ({
    ...option,
    arguments: transformArguments(option.arguments),
  }));

  const decisionContext = [
    jsonToMarkdown<Context>("context.partial.hbs", context),
    jsonToMarkdown<typeof transformedOptions>("options.partial.hbs", transformedOptions),
  ].join("\n\n");

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ])
    .pipe(model.withStructuredOutput(decisionSchema))
    .pipe((result) => decisionSchema.parse(result));

  return chain.invoke({ context: decisionContext });
}
