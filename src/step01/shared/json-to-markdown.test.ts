import { describe, expect, it } from "vitest";

import { type Adr } from "../adr/schema";
import { AdrEval } from "../eval/schema";
import { jsonToMarkdown } from "./json-to-markdown";

describe("json-to-markdown transformations", () => {
  it("converts ADR JSON to markdown", () => {
    const adr: Adr = {
      title: "Use PostgreSQL",
      context: "We need to choose a database for our application.",
      options: ["PostgreSQL", "MongoDB", "SQLite"],
      decision: {
        chosenOption: "PostgreSQL",
        justification: "meets all requirements and provides strong consistency",
      },
      consequences: [
        {
          impact: "Good",
          consequence: "Strong ACID guarantees ensure data integrity",
        },
        {
          impact: "Bad",
          consequence: "More complex setup and maintenance required",
        },
        {
          impact: "Neutral",
          consequence: "Requires SQL knowledge from team",
        },
      ],
    };

    const markdown = jsonToMarkdown("adr-template.md.hbs", adr);
    expect(markdown).toMatchSnapshot();
  });

  it("converts ADR evaluation JSON to markdown", () => {
    const evalResult: AdrEval = {
      title: "ADR Title",
      clear: 1,
      justified: 2,
      comprehensive: 3,
      actionable: 4,
      average: "2.50",
      comments: "Good ADR overall, but could use more context about the alternatives.",
      suggestions: ["Add more context about why MongoDB was considered", "Clarify the tradeoffs section"],
    };

    const markdown = jsonToMarkdown("eval-template.md.hbs", evalResult);
    expect(markdown).toMatchSnapshot();
  });

  it("handles empty suggestions array in evaluation", () => {
    const evalResult: AdrEval = {
      title: "Another ADR",
      clear: 5,
      justified: 4,
      comprehensive: 3,
      actionable: 2,
      average: "3.50",
      comments: "Perfect ADR, no suggestions needed.",
      suggestions: [],
    };

    const markdown = jsonToMarkdown("eval-template.md.hbs", evalResult);
    expect(markdown).toMatchSnapshot();
  });
});
