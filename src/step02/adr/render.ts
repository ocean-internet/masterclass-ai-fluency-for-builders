import { jsonToMarkdown } from "@shared/json-to-markdown";

import { type AdrData } from "./schema";

const ADR_TEMPLATE = "adr-full.hbs";

export function renderAdr(adrData: AdrData): string {
  return jsonToMarkdown<AdrData>(ADR_TEMPLATE, adrData);
}
