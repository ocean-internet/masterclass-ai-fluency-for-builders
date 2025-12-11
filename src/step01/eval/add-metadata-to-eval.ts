import type { LlmSchema } from "../evaluate-adr";
import { type AdrEval, adrEvalSchema } from "./schema";

export function addMetadataToEval(adrEval: LlmSchema, title: string): AdrEval {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { comments, suggestions, ...scores } = adrEval;
  const values = Object.values(scores) as number[];
  const average = (Object.values(values).reduce((acc, value) => acc + value) / 4).toFixed(2);
  return adrEvalSchema.parse({
    title,
    ...adrEval,
    average,
  });
}
