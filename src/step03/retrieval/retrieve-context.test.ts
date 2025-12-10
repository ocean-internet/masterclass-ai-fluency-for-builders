import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../../env";
import { getVectorStore } from "./create-vector-store";
import { retrieveContext } from "./retrieve-context";

vi.mock("./create-vector-store");

describe("retrieveContext", () => {
  const mockVectorStore = {
    similaritySearch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVectorStore).mockResolvedValue(
      mockVectorStore as unknown as Awaited<ReturnType<typeof getVectorStore>>,
    );
  });

  it("uses default k value when not specified", async () => {
    vi.mocked(mockVectorStore.similaritySearch).mockResolvedValue([]);

    await retrieveContext("test query");

    expect(mockVectorStore.similaritySearch).toHaveBeenCalledWith("test query", env.RAG_RETRIEVER_K);
  });

  it("handles documents without source metadata", async () => {
    const pageContent = "[Content]";
    vi.mocked(mockVectorStore.similaritySearch).mockResolvedValue([{ pageContent, metadata: {} }]);

    const result = await retrieveContext("test query", 1);

    expect(result).toContain("Source: ");
    expect(result).toContain(pageContent);
  });
});
