import { saveAdr } from "@shared/save-adr";
import { saveEval } from "@shared/save-eval";
import { evaluateAdr } from "@step01/evaluate-adr";
import { generateAdr as generateAdrStep01 } from "@step01/generate-adr";
import { generateAdr as generateAdrStep02 } from "@step02/generate-adr";

import { handleContext } from "./command-context";
import { handleDecision } from "./command-decision";
import { handleOptions } from "./command-options";
import { handleRender } from "./command-render";
import { showHelp } from "./show-help";
import type { CommandConfig } from "./types";

const GENERATE_COMMAND = "generate-02";

const commandsBase = {
  "generate-01": {
    description: "Generate ADR using single prompt (Step 01)",
    usage: "generate-01 <context-file>",
    handler: generateAdrStep01,
    save: ({ output }) => saveAdr(output),
    successMessage: "ADR generated successfully!",
  },
  "generate-02": {
    description: "Generate ADR using sequential chain (Step 02)",
    usage: "generate-02 <context-file>",
    handler: generateAdrStep02,
    save: ({ output }) => saveAdr(output),
    successMessage: "ADR generated successfully!",
  },
  context: {
    description: "Generate context and decision drivers (Step 02)",
    usage: "context <context-file>",
    handler: handleContext,
  },
  options: {
    description: "Generate options from context (Step 02)",
    usage: "options <context-json-file>",
    handler: handleOptions,
  },
  decision: {
    description: "Generate decision from context and options (Step 02)",
    usage: "decision <context-json-file> <options-json-file>",
    handler: handleDecision,
  },
  render: {
    description: "Render ADR from data (Step 02)",
    usage: "render <adr-data-json-file>",
    handler: handleRender,
  },
  evaluate: {
    description: "Evaluate an ADR (Step 01)",
    usage: "evaluate <adr-file>",
    handler: evaluateAdr,
    save: ({ input, output }) => saveEval(input, output),
    successMessage: "ADR evaluated successfully!",
  },
} as const satisfies Record<string, CommandConfig>;

export const commands = {
  ...commandsBase,
  help: {
    description: "Show this help message",
    usage: "help",
    handler: async (): Promise<string> => {
      showHelp();
      return "";
    },
  },
  generate: {
    ...commandsBase[GENERATE_COMMAND],
    description: commandsBase[GENERATE_COMMAND].description.replace(GENERATE_COMMAND, "generate"),
  },
} as const satisfies Record<string, CommandConfig>;
