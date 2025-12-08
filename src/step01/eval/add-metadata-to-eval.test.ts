import { describe, expect, it } from "vitest";

import type { LlmSchema } from "../evaluate-adr";
import { addMetadataToEval } from "./add-metadata-to-eval";

const baseInput = {
  comments: "test comment",
  suggestions: ["test suggestion"],
} satisfies Pick<LlmSchema, "comments" | "suggestions">;

describe("addMetadataToEval", () => {
  it("adds title", () => {
    const input: LlmSchema = {
      ...baseInput,
      clear: 3,
      justified: 3,
      comprehensive: 3,
      actionable: 3,
    };

    const result = addMetadataToEval(input, "Test ADR");

    expect(result.title).toBe("Test ADR");
  });

  it.each([
    { scores: { clear: 1, justified: 1, comprehensive: 1, actionable: 1 }, expected: "1.00" },
    { scores: { clear: 5, justified: 5, comprehensive: 5, actionable: 5 }, expected: "5.00" },
    { scores: { clear: 1, justified: 2, comprehensive: 4, actionable: 5 }, expected: "3.00" },
  ])("calculates scores", ({ scores, expected }) => {
    const input: LlmSchema = {
      ...baseInput,
      ...scores,
    };

    const result = addMetadataToEval(input, "Test ADR");

    expect(result.average).toBe(expected);
  });

  it("preserves data", () => {
    const input: LlmSchema = {
      ...baseInput,
      clear: 3,
      justified: 3,
      comprehensive: 3,
      actionable: 3,
    };

    const result = addMetadataToEval(input, "Test ADR");

    expect(result.comments).toBe(baseInput.comments);
    expect(result.suggestions).toEqual(baseInput.suggestions);
  });
});
