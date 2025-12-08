import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path/posix";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("../env", () => ({
  env: {
    ADR_OUTPUT_DIR: "/test/output",
  },
}));

import { saveAdr } from "./save-adr";

describe("saveAdr", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes file when it does not exist", () => {
    const markdown = "# Test ADR\n\nContent";
    const expectedFilename = join("/test/output", "0000-test-adr.md");
    vi.mocked(existsSync).mockReturnValue(false);

    const result = saveAdr(markdown);

    expect(writeFileSync).toHaveBeenCalledWith(expectedFilename, markdown, "utf-8");
    expect(result).toBe(expectedFilename);
  });

  it("throws error if file already exists", () => {
    const markdown = "# Test ADR\n\nContent";
    const expectedFilename = join("/test/output", "0000-test-adr.md");
    vi.mocked(existsSync).mockReturnValue(true);

    expect(() => saveAdr(markdown)).toThrow(`ADR file already exists: ${expectedFilename}`);
    expect(writeFileSync).not.toHaveBeenCalled();
  });
});
