import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildVectorStore, deleteVectorStore, getVectorStoreStatus } from "../step03/retrieval/create-vector-store";
import { handleVectorStoreBuild, handleVectorStoreDelete, handleVectorStoreStatus } from "./command-vectorstore";

vi.mock("../step03/retrieval/create-vector-store");

describe("handleVectorStoreBuild", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls buildVectorStore and returns success message", async () => {
    vi.mocked(buildVectorStore).mockResolvedValue({} as never);

    const result = await handleVectorStoreBuild();

    expect(buildVectorStore).toHaveBeenCalledTimes(1);
    expect(result).toBe("Vector store built successfully!");
  });
});

describe("handleVectorStoreStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns status when vector store exists with all fields", async () => {
    const mockStatus = {
      exists: true,
      path: "/path/to/vectorstore",
      lastModified: new Date("2024-01-01T00:00:00Z"),
      size: 1024 * 5, // 5 KB
    };

    vi.mocked(getVectorStoreStatus).mockReturnValue(mockStatus);

    const result = await handleVectorStoreStatus();

    expect(getVectorStoreStatus).toHaveBeenCalledTimes(1);
    expect(result).toContain("Vector store status:");
    expect(result).toContain("Path: /path/to/vectorstore");
    expect(result).toContain("Exists: Yes");
    expect(result).toContain("Last modified: 2024-01-01T00:00:00.000Z");
    expect(result).toContain("Size: 5.00 KB");
  });

  it("returns 'does not exist' message when vector store missing", async () => {
    const mockStatus = {
      exists: false,
      path: "/path/to/vectorstore",
    };

    vi.mocked(getVectorStoreStatus).mockReturnValue(mockStatus);

    const result = await handleVectorStoreStatus();

    expect(getVectorStoreStatus).toHaveBeenCalledTimes(1);
    expect(result).toBe("Vector store does not exist.\nRun 'yarn adr vectorstore:build' to create it.");
  });

  it("handles status without lastModified and size", async () => {
    const mockStatus = {
      exists: true,
      path: "/path/to/vectorstore",
    };

    vi.mocked(getVectorStoreStatus).mockReturnValue(mockStatus);

    const result = await handleVectorStoreStatus();

    expect(getVectorStoreStatus).toHaveBeenCalledTimes(1);
    expect(result).toContain("Vector store status:");
    expect(result).toContain("Path: /path/to/vectorstore");
    expect(result).toContain("Exists: Yes");
    expect(result).not.toContain("Last modified:");
    expect(result).not.toContain("Size:");
  });
});

describe("handleVectorStoreDelete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success message when deleting existing store", async () => {
    const mockStatus = {
      exists: true,
      path: "/path/to/vectorstore",
    };

    vi.mocked(getVectorStoreStatus).mockReturnValue(mockStatus);
    vi.mocked(deleteVectorStore).mockReturnValue(undefined);

    const result = await handleVectorStoreDelete();

    expect(getVectorStoreStatus).toHaveBeenCalledTimes(1);
    expect(deleteVectorStore).toHaveBeenCalledTimes(1);
    expect(result).toBe("Vector store deleted successfully!");
  });

  it("returns 'nothing to delete' message when store doesn't exist", async () => {
    const mockStatus = {
      exists: false,
      path: "/path/to/vectorstore",
    };

    vi.mocked(getVectorStoreStatus).mockReturnValue(mockStatus);

    const result = await handleVectorStoreDelete();

    expect(getVectorStoreStatus).toHaveBeenCalledTimes(1);
    expect(deleteVectorStore).not.toHaveBeenCalled();
    expect(result).toBe("Vector store does not exist. Nothing to delete.");
  });
});
