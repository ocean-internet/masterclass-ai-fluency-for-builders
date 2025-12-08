import { basename } from "node:path";

import { evaluateAdr } from "@step01/evaluate-adr";
import { generateAdr } from "@step01/generate-adr";

import { saveAdr } from "../shared/save-adr";
import { saveEval } from "../shared/save-eval";
import type { CommandConfig } from "./types";

export const commands = {
  generate: {
    description: "Generate ADR using single prompt (Step 01)",
    usage: "generate <context-file>",
    input: "file" as const,
    handler: generateAdr,
    save: ({ output }: { input: string; output: string }) => saveAdr(output),
    successMessage: "ADR generated successfully!",
  },
  evaluate: {
    description: "Evaluate an ADR (Step 01)",
    usage: "evaluate <adr-file>",
    input: "file" as const,
    handler: evaluateAdr,
    save: ({ input, output }: { input: string; output: string }) => saveEval(basename(input), output),
    successMessage: "ADR evaluated successfully!",
  },
} as const satisfies Record<string, CommandConfig>;
