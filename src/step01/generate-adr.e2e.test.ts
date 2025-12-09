import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { parseMadr } from "@test-utils/parse-madr";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";

import { generateAdr } from "./generate-adr";

const EXAMPLE_CONTEXT_FILE = "example-context.md";
describe("Single-Prompt ADR", () => {
  let adr = "";
  let title = "";
  let options: string[] = [];
  let decision = "";
  let consequences: string[] = [];

  beforeAll(async () => {
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const fixturesDir = join(__dirname, "../__fixtures__");
    const contextMarkdown = readFileSync(join(fixturesDir, EXAMPLE_CONTEXT_FILE), "utf-8");

    adr = await generateAdr(contextMarkdown);
    const parsed = await parseMadr(adr);
    title = parsed.title;
    options = parsed.options;
    decision = parsed.decision;
    consequences = parsed.consequences;
  }, E2E_TEST_TIMEOUT);

  it("produces a single-prompt-adr", () => {
    expect(adr).toMatch(new RegExp(`^#\\s*`, "i"));
    expect(adr).toMatch(/##\s*Context and Problem Statement/i);
    expect(adr).toMatch(/##\s*Considered Options/i);
    expect(adr).toMatch(/##\s*Decision Outcome/i);
    expect(adr).toMatch(/###\s*Consequences/i);
  });

  it("options section mentions Postgres, MongoDB, and a team 'choose' variant", () => {
    const mappedOptions = options.map(mapOption);

    expect(mappedOptions.length).toBe(3);
    expect(mappedOptions).not.toContain("ERROR");
    expect(mappedOptions).toEqual(expect.arrayContaining(["postgres", "mongo", "choose"]));
  });

  it("decision section contains one of the mapped options", () => {
    const mappedDecision = mapOption(decision);
    expect(["postgres", "mongo", "choose"]).toContain(mappedDecision);
  });

  it("consequences include at least one Good and one Bad", () => {
    expect(consequences.length).toBeGreaterThanOrEqual(2);
    expect(consequences.find((consequence) => consequence.startsWith("Good"))).toBeTruthy();
    expect(consequences.find((consequence) => consequence.startsWith("Bad"))).toBeTruthy();
  });

  it("title includes the chosen option and is a representative problem-solution summary", () => {
    const mappedDecision = mapOption(decision);

    const problem = ["cognitive load", "acid", "delivery", "workload", "expert"];
    let solution;

    switch (mappedDecision) {
      case "postgres":
      case "mongo":
        solution = ["standardise", mappedDecision];
        break;
      default:
        solution = [mappedDecision];
    }

    const lowerTitle = title.toLowerCase();

    expect(problem.some((p) => lowerTitle.includes(p))).toBeTruthy();
    expect(solution.every((s) => lowerTitle.includes(s))).toBeTruthy();
  });
});

function mapOption(option: string): "postgres" | "mongo" | "choose" | "ERROR" {
  const lower = option.toLowerCase();
  switch (true) {
    case lower.includes("postgres"):
      return "postgres";
    case lower.includes("mongo"):
      return "mongo";
    case lower.includes("team") && lower.includes("choose"):
    case lower.includes("team") && lower.includes("allow"):
      return "choose";
    default:
      return "ERROR";
  }
}
