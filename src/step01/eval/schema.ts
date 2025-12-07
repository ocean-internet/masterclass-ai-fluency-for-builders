import * as z from "zod";

export const adrEvalSchema = z.object({
  title: z.string(),
  clear: z.number().min(1).max(5).describe("Clarity of the ADR (1-5)"),
  justified: z.number().min(1).max(5).describe("Completeness of the ADR (1-5)"),
  comprehensive: z.number().min(1).max(5).describe("Quality of tradeoff analysis (1-5)"),
  actionable: z.number().min(1).max(5).describe("Quality of decision rationale (1-5)"),
  average: z.string().length(4),
  comments: z.string().describe("General comments on the ADR"),
  suggestions: z.array(z.string()).describe("Suggestions for improvement"),
});
export type AdrEval = z.infer<typeof adrEvalSchema>;
