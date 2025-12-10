import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { jsonToMarkdown } from "@shared/json-to-markdown";
import { loadPromptTemplate } from "@shared/load-prompt-template";
import { type Context } from "@step02/context/schema";
import { type Option, optionSchema } from "@step02/options/schema";
import * as z from "zod";

import { env } from "../../env";
import { retrieveContext } from "../retrieval/retrieve-context";

const SYSTEM_PROMPT = "system.md";
const OPTIONS_PROMPT = "generate-options-03.md";

const llmOptionsSchema = z.object({ options: z.array(optionSchema.omit({ uuid: true })) });

function buildQuery({ description, drivers }: Context): string {
  return [`Description: ${description}`, `Decision drivers:`, ...drivers].join("\n");
}

export async function generateOptions(data: Context): Promise<Option[]> {
  const model = new ChatOllama({
    model: env.OLLAMA_MODEL,
    baseUrl: env.OLLAMA_HOST,
    temperature: 0,
  });

  const systemPrompt = loadPromptTemplate(SYSTEM_PROMPT);
  const humanPrompt = loadPromptTemplate(OPTIONS_PROMPT);

  const background = await retrieveContext(buildQuery(data));
  const context = jsonToMarkdown<Context>("context.partial.hbs", data);

  const chain = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ])
    .pipe(model.withStructuredOutput(llmOptionsSchema))
    .pipe(({ options }) => z.array(optionSchema).parse(options));

  return chain.invoke({ background, context });
}
