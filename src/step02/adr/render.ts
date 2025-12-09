import { jsonToMarkdown } from "@shared/json-to-markdown";

import { transformConsequences as mapConsequences } from "../decision/schema";
import { transformArguments as mapArguments } from "../options/schema";
import { type AdrData } from "./schema";

const ADR_TEMPLATE = "adr-full.hbs";

export function renderAdr(adrData: AdrData): string {
  const transformedData = {
    ...adrData,
    options: adrData.options.map((option) => ({
      ...option,
      arguments: mapArguments(option.arguments),
    })),
    decision: {
      ...adrData.decision,
      consequences: mapConsequences(adrData.decision.consequences),
    },
  };
  return jsonToMarkdown<typeof transformedData>(ADR_TEMPLATE, transformedData);
}
