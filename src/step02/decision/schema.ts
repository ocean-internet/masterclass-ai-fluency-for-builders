import * as z from "zod";

export const decisionSchema = z.object({
  title: z
    .string()
    .trim()
    .describe(
      "Short title, representative of solved problem and found solution. A short present tense imperative phrase - 8–12 words. Summarises: (1) chosenOption described in decision, (2) Key driver/problem described in context.",
    ),
  chosenOption: z.string().trim().describe("Title of chosen option"),
  justification: z
    .string()
    .trim()
    .describe(
      "Justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force | comes out best",
    ),
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
    .refine((consequences) => consequences.some((c) => c.impact === "Good"), {
      message: "Must have at least one Good consequence",
    })
    .refine((consequences) => consequences.some((c) => c.impact === "Bad"), {
      message: "Must have at least one Bad consequence",
    })
    .describe("Consequences"),
});

export type Decision = z.infer<typeof decisionSchema>;
