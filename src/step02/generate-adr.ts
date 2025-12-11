import { RunnableLambda, RunnablePassthrough } from "@langchain/core/runnables";
import ora from "ora";

import { extractAdrData } from "./adr/extract-adr-data";
import { renderAdr } from "./adr/render-adr";
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

const isTestEnvironment = process.env["NODE_ENV"] === "test" || process.env["VITEST"] !== undefined;

export async function generateAdr(context: string): Promise<string> {
  const progress = ora({
    isSilent: isTestEnvironment,
  }).start();

  progress.info("Generating ADR:");
  progress.indent = 2;
  try {
    const runnable = RunnablePassthrough.assign({})
      .assign({
        context: async () => {
          progress.start("Generating context...");

          const result = await generateContext(context);

          progress.succeed("Context generated");
          return result;
        },
      })
      .assign({
        options: async ({ context }: OptionsInput) => {
          progress.start("Generating options...");

          const result = await generateOptions(context);

          progress.succeed("Options generated");
          return result;
        },
      })
      .assign({
        decision: async ({ context, options }: DecisionInput) => {
          progress.start("Generating decision...");

          const result = await generateDecision(context, options);

          progress.succeed("Decision generated");
          return result;
        },
      })
      .assign({ adrData: (input: AdrDataInput): AdrData => extractAdrData(input) })
      .pipe(
        RunnableLambda.from(({ adrData }) => {
          progress.start("Rendering ADR...");

          const result = renderAdr(adrData);

          progress.succeed("ADR rendered");
          return result;
        }),
      );
    return runnable.invoke({ context });
  } catch (error) {
    progress.fail(`Failed to generate ADR: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
