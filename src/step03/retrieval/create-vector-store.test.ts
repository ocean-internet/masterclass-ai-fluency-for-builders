import { existsSync, rmSync, statSync } from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  statSync: vi.fn(),
  rmSync: vi.fn(),
}));

import { env } from "../../env";
import { deleteVectorStore, getVectorStoreStatus } from "./create-vector-store";

describe("getVectorStoreStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      exists: true,
      mockStats: { mtime: new Date("2024-01-01T00:00:00Z"), size: 5120 },
      expected: { exists: true, path: env.RAG_VECTOR_STORE_DIR, lastModified: expect.any(Date), size: 5120 },
    },
    {
      exists: false,
      mockStats: null,
      expected: { exists: false, path: env.RAG_VECTOR_STORE_DIR },
    },
  ])("returns status when store $exists", ({ exists, mockStats, expected }) => {
    vi.mocked(existsSync).mockReturnValue(exists);
    if (mockStats) {
      vi.mocked(statSync).mockReturnValue(mockStats as never);
    }

    const result = getVectorStoreStatus();

    expect(result).toMatchObject(expected);
    if (!exists) {
      expect(result.lastModified).toBeUndefined();
      expect(result.size).toBeUndefined();
    }
  });
});

describe("deleteVectorStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes store when it exists", () => {
    vi.mocked(existsSync).mockReturnValue(true);

    deleteVectorStore();

    expect(rmSync).toHaveBeenCalledWith(env.RAG_VECTOR_STORE_DIR, { recursive: true, force: true });
  });

  it("does nothing when store doesn't exist", () => {
    vi.mocked(existsSync).mockReturnValue(false);

    deleteVectorStore();

    expect(rmSync).not.toHaveBeenCalled();
  });
});
