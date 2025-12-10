import { join, resolve } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../env", async () => {
  const actual = await vi.importActual<typeof import("../../env")>("../../env");
  const fixturesPdfDir = resolve(FIXTURES_DIR, "source-pdfs");
  return {
    ...actual,
    env: {
      ...actual.env,
      RAG_SOURCE_PDFS_DIR: fixturesPdfDir,
    },
  };
});

import { readFileSync } from "node:fs";

import { generateContext } from "@step02/context/generate";

import { retrieveContext } from "./retrieve-context";

describe("retrieveContext E2E", () => {
  it(
    "retrieves relevant chunks from vectorstore given ADR context",
    async () => {
      const contextMarkdown = readFileSync(join(FIXTURES_DIR, "example-context.md"), "utf-8");
      const context = await generateContext(contextMarkdown);

      const query = `Description: ${context.description}\nDecision drivers:\n${context.drivers.join("\n")}`;
      const retrieved = await retrieveContext(query, 4);

      expect(retrieved.length).toBeGreaterThan(0);
      expect(retrieved).toContain("Source:");
    },
    E2E_TEST_TIMEOUT,
  );
});
