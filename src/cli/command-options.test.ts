import { join } from "node:path";

import { generateOptions } from "@step02/options/generate";
import { FIXTURES_DIR } from "@test-utils/config";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleOptions } from "./command-options";

vi.mock("@step02/options/generate");

describe("handleOptions", () => {
  const mockOptions = [
    {
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      title: "Option 1",
      description: "First option description",
      arguments: [
        { impact: "Good" as const, argument: "Good argument 1" },
        { impact: "Bad" as const, argument: "Bad argument 1" },
      ],
    },
    {
      uuid: "223e4567-e89b-12d3-a456-426614174001",
      title: "Option 2",
      description: "Second option description",
      arguments: [
        { impact: "Good" as const, argument: "Good argument 2" },
        { impact: "Bad" as const, argument: "Bad argument 2" },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateOptions).mockResolvedValue(mockOptions);
  });

  it("reads context file, calls generateOptions, and returns JSON", async () => {
    const contextJsonFile = join(FIXTURES_DIR, "example-context.json");

    const result = await handleOptions(contextJsonFile);
    const options = JSON.parse(result);

    expect(generateOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.any(String),
        drivers: expect.any(Array),
      }),
    );
    expect(options).toBeInstanceOf(Array);
    expect(options.length).toBeGreaterThanOrEqual(2);
  });
});
