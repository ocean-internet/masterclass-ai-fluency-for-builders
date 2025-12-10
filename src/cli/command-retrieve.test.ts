import { readFileSync } from "node:fs";
import { join } from "node:path";

import { FIXTURES_DIR } from "@test-utils/config";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { retrieveContext } from "../step03/retrieval/retrieve-context";
import { handleRetrieve } from "./command-retrieve";

vi.mock("../step03/retrieval/retrieve-context");
vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

const contextJsonFile = join(FIXTURES_DIR, "example-context.json");

describe("handleRetrieve", () => {
  let contextJsonContent: string;
  let context: { description: string; drivers: string[] };

  beforeAll(async () => {
    const fs = await vi.importActual<typeof import("node:fs")>("node:fs");
    contextJsonContent = fs.readFileSync(contextJsonFile, "utf-8");
    context = JSON.parse(contextJsonContent);
  });

  const mockRetrievedContext = "Retrieved context content from vector store";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(retrieveContext).mockResolvedValue(mockRetrievedContext);
    vi.mocked(readFileSync).mockReturnValue(contextJsonContent);
  });

  it("reads context JSON file and calls retrieveContext with correct query", async () => {
    const result = await handleRetrieve(contextJsonFile);

    expect(readFileSync).toHaveBeenCalledWith(contextJsonFile, "utf-8");
    expect(retrieveContext).toHaveBeenCalledWith(
      `Description: ${context.description}\nDecision drivers:\n${context.drivers.join("\n")}`,
    );
    expect(result).toBe(mockRetrievedContext);
  });
});
