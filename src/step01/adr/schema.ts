import * as z from "zod";

export const adrSchema = z.object({
  title: z.string().trim().describe("Short title, representative of solved problem and found solution."),
  context: z
    .string()
    .trim()
    .describe(
      "Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems.",
    ),
  options: z.array(z.string().trim().describe("Title of option.")).min(2).describe("Considered Options"),
  decision: z
    .object({
      chosenOption: z.string().trim().describe("Title of option"),
      justification: z
        .string()
        .trim()
        .describe(
          "Justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best",
        ),
    })
    .describe("Decision Outcome"),
  consequences: z
    .array(
      z.object({
        impact: z.enum(["Good", "Bad", "Neutral"]).describe("Impact of the consequence."),
        consequence: z
          .string()
          .trim()
          .describe(
            'Description of the consequence, e.g., "improvement of one or more desired qualities", … or "compromising one or more desired qualities, …".',
          ),
      }),
    )
    .min(2)
    .describe("Consequences"),
});
export type Adr = z.infer<typeof adrSchema>;
