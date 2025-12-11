import { join } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../env", async () => {
  const actual = await vi.importActual<typeof import("../../env")>("../../env");
  const fixturesPdfDir = join(FIXTURES_DIR, "source-pdfs");
  return {
    ...actual,
    env: {
      ...actual.env,
      RAG_SOURCE_PDFS_DIR: fixturesPdfDir,
    },
  };
});

import { loadDocuments } from "./load-documents";

describe("loadDocuments", () => {
  it(
    "loads documents with enriched metadata",
    async () => {
      const result = await loadDocuments();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]?.metadata).toHaveProperty("source");
    },
    E2E_TEST_TIMEOUT,
  );
});
