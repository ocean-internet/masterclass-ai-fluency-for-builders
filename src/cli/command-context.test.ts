import { join } from "node:path";

import { generateContext } from "@step02/context/generate";
import { FIXTURES_DIR } from "@test-utils/config";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleContext } from "./command-context";

vi.mock("@step02/context/generate");

describe("handleContext", () => {
  const mockContext = {
    description: "Test context description",
    drivers: ["Driver 1", "Driver 2"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateContext).mockResolvedValue(mockContext);
  });

  it("reads context file, calls generateContext, and returns markdown", async () => {
    const contextFile = join(FIXTURES_DIR, "example-context.md");
    const result = await handleContext(contextFile);

    expect(generateContext).toHaveBeenCalledWith(expect.any(String));
    expect(result.length).toBeGreaterThan(0);
  });
});
