import { writeFileSync } from "node:fs";
import { join } from "node:path/posix";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => ({
  writeFileSync: vi.fn(),
}));

vi.mock("../env", () => ({
  env: {
    ADR_DRAFTS_DIR: "/test/output",
  },
}));

import { saveEval } from "./save-eval";

describe("saveEval", () => {
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
