import { join } from "node:path";

import { generateDecision } from "@step02/decision/generate";
import { FIXTURES_DIR } from "@test-utils/config";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleDecision } from "./command-decision";

vi.mock("@step02/decision/generate");

describe("handleDecision", () => {
  const mockDecision = {
    title: "Test Decision Title",
    chosenOption: "Option 1",
    justification: "Test justification",
    consequences: [
      { impact: "Good" as const, consequence: "Good consequence" },
      { impact: "Bad" as const, consequence: "Bad consequence" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateDecision).mockResolvedValue(mockDecision);
  });

  it("reads context and options files, calls generateDecision, and returns JSON", async () => {
    const contextJsonFile = join(FIXTURES_DIR, "example-context.json");
    const optionsJsonFile = join(FIXTURES_DIR, "example-options.json");

    const result = await handleDecision(contextJsonFile, optionsJsonFile);
    const decision = JSON.parse(result);

    expect(generateDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.any(String),
        drivers: expect.any(Array),
      }),
      expect.any(Array),
    );
    expect(decision).toMatchObject({
      title: expect.any(String),
      chosenOption: expect.any(String),
    });
  });
});
