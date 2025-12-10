import { randomUUID } from "crypto";
import * as z from "zod";

export const argumentSchema = z.object({
  impact: z.enum(["Good", "Bad", "Neutral"]).describe("Impact of the argument"),
  argument: z.string().trim().describe("The argument"),
});

type Argument = z.infer<typeof argumentSchema>;

export const mappedArgumentsSchema = z.object({
  good: z.array(z.string()),
  neutral: z.array(z.string()),
  bad: z.array(z.string()),
});
export type MappedArguments = z.infer<typeof mappedArgumentsSchema>;

export function transformArguments(args: Argument[]): MappedArguments {
  return {
    good: args.filter(({ impact }) => impact === "Good").map(({ argument }) => argument),
    neutral: args.filter(({ impact }) => impact === "Neutral").map(({ argument }) => argument),
    bad: args.filter(({ impact }) => impact === "Bad").map(({ argument }) => argument),
  };
}

export const optionSchema = z.object({
  uuid: z
    .uuid()
    .default(() => randomUUID())
    .describe("UUID identifier for the option"),
  title: z.string().trim().describe("Title of option"),
  description: z.string().trim().describe("Description, example, or pointer to more information about this option"),
  arguments: z
    .array(
      z.object({
        impact: z.enum(["Good", "Bad", "Neutral"]).describe("Impact of the argument"),
        argument: z.string().trim().describe("The argument"),
      }),
    )
    .min(2)
    .refine((args) => args.some((arg) => arg.impact === "Good"), { message: "Must have at least one Good argument" })
    .refine((args) => args.some((arg) => arg.impact === "Bad"), { message: "Must have at least one Bad argument" })
    .describe("List of arguments for this option (pros, cons, and neutral)"),
});
export type Option = z.infer<typeof optionSchema>;
