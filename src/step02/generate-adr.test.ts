import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateAdrData } from "./adr/generate-adr-data";
import { renderAdr } from "./adr/render";
import { generateContext } from "./context/generate";
import { generateDecision } from "./decision/generate";
import { generateAdr } from "./generate-adr";
import { generateOptions } from "./options/generate";

vi.mock("./context/generate");
vi.mock("./options/generate");
vi.mock("./decision/generate");
vi.mock("./adr/generate-adr-data");
vi.mock("./adr/render");

describe("generateAdr", () => {
  const mockContext = {
    description: "Test context description",
    drivers: ["Driver 1", "Driver 2"],
  };

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

  const mockDecision = {
    title: "Test Decision Title",
    chosenOption: "Option 1",
    justification: "Test justification",
    consequences: [
      { impact: "Good" as const, consequence: "Good consequence" },
      { impact: "Bad" as const, consequence: "Bad consequence" },
    ],
  };

  const mockAdrData = {
    title: "Test Decision Title",
    context: mockContext,
    options: mockOptions,
    decision: {
      chosenOption: "Option 1",
      justification: "Test justification",
      consequences: mockDecision.consequences,
    },
  };

  const mockRenderedAdr = "# Test Decision Title\n\n## Context\n\nTest context";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateContext).mockResolvedValue(mockContext);
    vi.mocked(generateOptions).mockResolvedValue(mockOptions);
    vi.mocked(generateDecision).mockResolvedValue(mockDecision);
    vi.mocked(generateAdrData).mockReturnValue(mockAdrData);
    vi.mocked(renderAdr).mockReturnValue(mockRenderedAdr);
  });

  it("orchestrates the chain correctly with mocked data", async () => {
    const inputContext = "Test context input";
    const result = await generateAdr(inputContext);

    expect(generateContext).toHaveBeenCalledWith(inputContext);
    expect(generateOptions).toHaveBeenCalledWith(mockContext);
    expect(generateDecision).toHaveBeenCalledWith(mockContext, mockOptions);
    expect(generateAdrData).toHaveBeenCalledWith({
      context: mockContext,
      options: mockOptions,
      decision: mockDecision,
    });
    expect(renderAdr).toHaveBeenCalledWith(mockAdrData);
    expect(result).toBe(mockRenderedAdr);
  });
});
