import { beforeEach, vi } from "vitest";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

import { readFileSync } from "node:fs";

vi.mock("./shared/save-adr", () => ({
  saveAdr: vi.fn(() => `/test/output/0000-test-adr.md`),
}));

vi.mock("./shared/save-eval", () => ({
  saveEval: vi.fn((filename: string) => `/test/output/${filename}.eval.md`),
}));

vi.mock("./step01/generate-adr", () => ({
  generateAdr: vi.fn(async () => "# Test ADR\n\nContent"),
}));

vi.mock("./step01/evaluate-adr", () => ({
  evaluateAdr: vi.fn(async () => "# ADR Evaluation\n\nContent"),
}));

vi.mock("./step02/generate-adr", () => ({
  generateAdr: vi.fn(async () => "# Test ADR Chain\n\nContent"),
}));

vi.mock("./step02/context/generate", () => ({
  generateContext: vi.fn(async () => ({ description: "Test", drivers: ["Driver 1"] })),
}));

vi.mock("./step02/options/generate", () => ({
  generateOptions: vi.fn(async () => [{ uuid: "uuid-1", title: "Option 1", description: "Desc", arguments: [] }]),
}));

vi.mock("./step02/decision/generate", () => ({
  generateDecision: vi.fn(async () => ({
    title: "Test Title",
    chosenOption: "Option 1",
    justification: "Justification",
    consequences: [],
  })),
}));

vi.mock("./step02/adr/render", () => ({
  renderAdr: vi.fn(() => "# Rendered ADR\n\nContent"),
}));

vi.mock("./shared/json-to-markdown", () => ({
  jsonToMarkdown: vi.fn(() => "# Context Markdown\n\nContent"),
}));

export function setupTestMocks(exitSpy: ReturnType<typeof vi.fn>): void {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
    process.exit = exitSpy as never;
    vi.mocked(readFileSync).mockReturnValue("test content");
  });
}
