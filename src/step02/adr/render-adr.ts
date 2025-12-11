import { jsonToMarkdown } from "@shared/json-to-markdown";
import z from "zod";

import { consequenceSchema, decisionSchema, transformConsequences as mapConsequences } from "../decision/schema";
import { argumentSchema, optionSchema, transformArguments as mapArguments } from "../options/schema";
import { type AdrData, adrDataSchema } from "./schema";

const ADR_TEMPLATE = "adr-full.hbs";

const adrTemplateSchema = adrDataSchema.omit({ options: true, decision: true }).extend({
  options: z.array(
    optionSchema.omit({ arguments: true }).extend({
      arguments: z.array(argumentSchema).transform(mapArguments),
    }),
  ),
  decision: decisionSchema.omit({ title: true, consequences: true }).extend({
    consequences: z.array(consequenceSchema).transform(mapConsequences),
  }),
});
type AdrTemplateSchema = z.infer<typeof adrTemplateSchema>;

export const renderAdr = (adrData: AdrData): string =>
  jsonToMarkdown<AdrTemplateSchema>(ADR_TEMPLATE, adrTemplateSchema.parse(adrData));
