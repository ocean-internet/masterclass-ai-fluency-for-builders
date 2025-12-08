import * as z from "zod";

import { contextSchema } from "../context/schema";
import { decisionSchema } from "../decision/schema";
import { optionSchema } from "../options/schema";

export const adrDataSchema = decisionSchema.pick({ title: true }).extend({
  context: contextSchema,
  options: z.array(optionSchema),
  decision: decisionSchema.omit({ title: true }),
});

export type AdrData = z.infer<typeof adrDataSchema>;
