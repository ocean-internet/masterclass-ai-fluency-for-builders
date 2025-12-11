import { readFileSync } from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

vi.mock("handlebars", () => ({
  default: {
    registerPartial: vi.fn(),
    compile: vi.fn((template) => () => template),
  },
}));

import { jsonToMarkdown } from "./json-to-markdown";

describe("jsonToMarkdown newline normalization", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const testTemplate = `
Line 1


Line 2


Line 3


`;

    vi.mocked(readFileSync).mockReturnValue(testTemplate);
  });

  it("collapses 3+ consecutive newlines to 2 newlines", () => {
    const result = jsonToMarkdown("any-template.hbs", {});

    expect(result).toBe(`
Line 1

Line 2

Line 3

`);
  });
});
