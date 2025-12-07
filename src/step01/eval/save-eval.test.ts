import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { saveEval } from "./save-eval";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("../../env", () => ({
  env: {
    ADR_OUTPUT_DIR: "/test/output",
  },
}));

describe("saveEvalMarkdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes file with correct path and content", () => {
    const adrFilename = "0000-test-adr.md";
    const markdown = "# Evaluation\n\nContent";
    const expectedFilename = join("/test/output", "0000-test-adr.eval.md");

    const result = saveEval(adrFilename, markdown);

    expect(writeFileSync).toHaveBeenCalledWith(expectedFilename, markdown, "utf-8");
    expect(result).toBe(expectedFilename);
  });
});
