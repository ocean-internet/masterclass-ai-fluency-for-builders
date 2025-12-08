import * as z from "zod";

export const contextSchema = z.object({
  description: z
    .string()
    .trim()
    .describe(
      "Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems.",
    ),
  drivers: z
    .array(z.string().trim().describe("Decision driver, e.g., a force, facing concern"))
    .min(1)
    .describe("List of decision drivers that influence the decision"),
});

export type Context = z.infer<typeof contextSchema>;
