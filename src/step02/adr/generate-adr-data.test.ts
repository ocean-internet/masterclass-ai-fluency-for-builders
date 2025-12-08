import { describe, expect, it } from "vitest";

import type { Context } from "../context/schema";
import type { Decision } from "../decision/schema";
import type { Option } from "../options/schema";
import { generateAdrData } from "./generate-adr-data";

describe("generateAdrData", () => {
  it("maps input to output structure", () => {
    const context: Context = {
      description: "Test",
      drivers: ["Driver 1"],
    };

    const options: Option[] = [
      {
        uuid: "uuid-1",
        title: "Option 1",
        description: "Description",
        arguments: [
          { impact: "Good", argument: "Good point" },
          { impact: "Bad", argument: "Bad point" },
        ],
      },
    ];

    const decision: Decision = {
      title: "Test Title",
      chosenOption: "Option 1",
      justification: "Justification",
      consequences: [
        { impact: "Good", consequence: "Good consequence" },
        { impact: "Bad", consequence: "Bad consequence" },
      ],
    };

    const result = generateAdrData({ context, options, decision });

    expect(result).toEqual({
      title: "Test Title",
      context,
      options,
      decision: {
        chosenOption: "Option 1",
        justification: "Justification",
        consequences: [
          { impact: "Good", consequence: "Good consequence" },
          { impact: "Bad", consequence: "Bad consequence" },
        ],
      },
    });
  });
});
