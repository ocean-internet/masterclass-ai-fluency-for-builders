import { tmpdir } from "node:os";
import { resolve } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock node:fs first with importOriginal to keep mkdtempSync available
vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    existsSync: vi.fn(),
    rmSync: vi.fn(),
  };
});

vi.mock("../../env", async () => {
  const actual = await vi.importActual<typeof import("../../env")>("../../env");
  const { mkdtempSync } = await import("node:fs");
  const fixturesPdfDir = resolve(FIXTURES_DIR, "source-pdfs");
  // Create a temporary directory for the vectorstore in e2e tests
  const tempVectorStoreDir = mkdtempSync(resolve(tmpdir(), "vectorstore-e2e-"));
  return {
    ...actual,
    env: {
      ...actual.env,
      RAG_SOURCE_PDFS_DIR: fixturesPdfDir,
      RAG_VECTOR_STORE_DIR: tempVectorStoreDir,
    },
  };
});

import { existsSync } from "node:fs";

import { getVectorStore } from "./create-vector-store";

describe("getVectorStore E2E", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up: reset the module to clear the cached vectorStorePromise
    // This ensures each test starts fresh
    vi.resetModules();
  });

  it(
    "creates vector store when it doesn't exist",
    async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const store = await getVectorStore();

      const results = await store.similaritySearch("database", 2);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(2);
    },
    E2E_TEST_TIMEOUT,
  );

  it(
    "loads existing store when it exists",
    async () => {
      vi.mocked(existsSync).mockReturnValue(true);
      const store = await getVectorStore();

      const results = await store.similaritySearch("database", 2);
      expect(results.length).toBeGreaterThan(0);
    },
    E2E_TEST_TIMEOUT,
  );

  it(
    "returns cached promise on subsequent calls",
    async () => {
      vi.mocked(existsSync).mockReturnValue(true);

      const store1 = await getVectorStore();
      const store2 = await getVectorStore();

      expect(store1).toBe(store2);
    },
    E2E_TEST_TIMEOUT,
  );
});
