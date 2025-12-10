import { saveAdr } from "@shared/save-adr";
import { saveEval } from "@shared/save-eval";
import { evaluateAdr } from "@step01/evaluate-adr";
import { generateAdr as generateAdrStep01 } from "@step01/generate-adr";
import { generateAdr as generateAdrStep02 } from "@step02/generate-adr";

import { generateAdr as generateAdrStep03 } from "../step03/generate-adr";
import { handleContext } from "./command-context";
import { handleDecision } from "./command-decision";
import { handleOptions } from "./command-options";
import { handleOptions03 } from "./command-options-03";
import { handleRender } from "./command-render";
import { handleRetrieve } from "./command-retrieve";
import { handleVectorStoreBuild, handleVectorStoreDelete, handleVectorStoreStatus } from "./command-vectorstore";
import { showHelp } from "./show-help";
import type { CommandConfig } from "./types";

const GENERATE_COMMAND = "generate-03";
const OPTIONS_COMMAND = "options-03";

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
  "generate-03": {
    description: "Generate ADR using retrieval-augmented options (Step 03)",
    usage: "generate-03 <context-file>",
    handler: generateAdrStep03,
    save: ({ output }) => saveAdr(output),
    successMessage: "ADR generated successfully!",
  },
  context: {
    description: "Generate context and decision drivers (Step 02)",
    usage: "context <context-file>",
    handler: handleContext,
  },
  "options-02": {
    description: "Generate options from context (Step 02)",
    usage: "options <context-json-file>",
    handler: handleOptions,
  },
  "options-03": {
    description: "Generate options with retrieval from PDFs (Step 03)",
    usage: "options-03 <context-json-file>",
    handler: handleOptions03,
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
  "vectorstore:build": {
    description: "Build and save the vector store from PDFs (Step 03)",
    usage: "vectorstore:build",
    handler: handleVectorStoreBuild,
  },
  "vectorstore:status": {
    description: "Check vector store status and info",
    usage: "vectorstore:status",
    handler: handleVectorStoreStatus,
  },
  "vectorstore:delete": {
    description: "Delete the vector store",
    usage: "vectorstore:delete",
    handler: handleVectorStoreDelete,
  },
  retrieve: {
    description: "Retrieve context from vector store (Step 03)",
    usage: "retrieve <context-json-file>",
    handler: handleRetrieve,
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
  options: {
    ...commandsBase[OPTIONS_COMMAND],
    description: commandsBase[OPTIONS_COMMAND].description.replace(OPTIONS_COMMAND, "options"),
  },
} as const satisfies Record<string, CommandConfig>;
