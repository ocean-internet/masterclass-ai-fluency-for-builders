import { RunnableLambda, RunnablePassthrough } from "@langchain/core/runnables";

import { generateAdrData } from "./adr/generate-adr-data";
import { renderAdr } from "./adr/render";
import type { AdrData } from "./adr/schema";
import { generateContext } from "./context/generate";
import { generateDecision } from "./decision/generate";
import { generateOptions } from "./options/generate";

type OptionsInput = { context: Awaited<ReturnType<typeof generateContext>> };

type DecisionInput = {
  context: Awaited<ReturnType<typeof generateContext>>;
  options: Awaited<ReturnType<typeof generateOptions>>;
};

type AdrDataInput = {
  context: Awaited<ReturnType<typeof generateContext>>;
  options: Awaited<ReturnType<typeof generateOptions>>;
  decision: Awaited<ReturnType<typeof generateDecision>>;
};

export async function generateAdr(context: string): Promise<string> {
  const chain = RunnablePassthrough.assign({ context: () => generateContext(context) })
    .assign({ options: ({ context }: OptionsInput) => generateOptions(context) })
    .assign({ decision: ({ context, options }: DecisionInput) => generateDecision(context, options) })
    .assign({ adrData: (input: AdrDataInput): AdrData => generateAdrData(input) })
    .pipe(RunnableLambda.from(({ adrData }) => renderAdr(adrData)));

  return await chain.invoke({ context });
}
