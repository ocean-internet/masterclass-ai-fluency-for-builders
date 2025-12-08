import { describe, expect, it } from "vitest";

import { generateFilename } from "./generate-eval-filename";

describe("generateEvalFilename", () => {
  it.each([
    ["0000-use-postgresql.md", "0000-use-postgresql.eval.md"],
    ["0000-use-postgresql", "0000-use-postgresql.eval.md"],
    ["docs/0000-use-postgresql.md", "docs/0000-use-postgresql.eval.md"],
  ])("replaces .md with .eval.md", (adrFilename, expected) => {
    expect(generateFilename(adrFilename)).toBe(expected);
  });
});
