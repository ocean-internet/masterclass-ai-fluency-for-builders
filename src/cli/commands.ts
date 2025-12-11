import { saveAdr } from "@shared/save-adr";
import { saveEval } from "@shared/save-eval";
import { evaluateAdr } from "@step01/evaluate-adr";
import { generateAdr as generateAdrStep01 } from "@step01/generate-adr";

import type { CommandConfig } from "./types";

export const commands = {
  generate: {
    description: "Generate ADR using single prompt (Step 01)",
    usage: "generate-01 <context-file>",
    handler: generateAdrStep01,
    save: ({ output }) => saveAdr(output),
    successMessage: "ADR generated successfully!",
  },
  evaluate: {
    description: "Evaluate an ADR (Step 01)",
    usage: "evaluate <adr-file>",
    handler: evaluateAdr,
    save: ({ input, output }) => saveEval(input, output),
    successMessage: "ADR evaluated successfully!",
  },
} as const satisfies Record<string, CommandConfig>;
