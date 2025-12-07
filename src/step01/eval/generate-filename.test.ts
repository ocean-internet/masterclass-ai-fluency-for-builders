import { describe, expect, it } from "vitest";

import { generateFilename } from "./generate-filename";

describe("generateEvalFilename", () => {
  it("replaces .md with .eval.md", () => {
    const adrFilename = "0000-use-postgresql.md";
    const evalFilename = generateFilename(adrFilename);
    expect(evalFilename).toBe("0000-use-postgresql.eval.md");
  });

  it("handles filenames without .md extension", () => {
    const adrFilename = "0000-use-postgresql";
    const evalFilename = generateFilename(adrFilename);
    expect(evalFilename).toBe("0000-use-postgresql.eval.md");
  });

  it("handles filenames with path", () => {
    const adrFilename = "docs/0000-use-postgresql.md";
    const evalFilename = generateFilename(adrFilename);
    expect(evalFilename).toBe("docs/0000-use-postgresql.eval.md");
  });
});
