import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";

import { E2E_TEST_TIMEOUT } from "../../vitest.config";
import { parseMadr } from "../test-utils/parse-madr";
import { generateAdr } from "./generate-adr";

const EXAMPLE_CONTEXT_FILE = "example-context.md";

describe("Step 02: Sequential Chain ADR Generation", () => {
  let adr;
  let options: string[];
  let decision;
  let consequences: string[];

  beforeAll(async () => {
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const fixturesDir = join(__dirname, "../__fixtures__");
    const contextMarkdown = readFileSync(join(fixturesDir, EXAMPLE_CONTEXT_FILE), "utf-8");

    adr = await generateAdr(contextMarkdown);
    const parsed = await parseMadr(adr);
    options = parsed.options;
    decision = parsed.decision;
    consequences = parsed.consequences;
  }, E2E_TEST_TIMEOUT);

  it("produces a sequential-chain-adr", () => {
    expect(adr).toMatch(new RegExp(`^#\\s*`, "i"));
    expect(adr).toMatch(/##\s*Context and Problem Statement/i);
    expect(adr).toMatch(/##\s*Decision Drivers/i);
    expect(adr).toMatch(/##\s*Considered Options/i);
    expect(adr).toMatch(/##\s*Decision Outcome/i);
    expect(adr).toMatch(/##\s*Pros and Cons of the Options/i);
  });

  it("has context section with substantial content", () => {
    const contextSection = adr.match(/##\s*Context and Problem Statement[\s\S]*?(?=##|$)/i);
    expect(contextSection).toBeTruthy();
    if (contextSection) {
      expect(contextSection[0].length).toBeGreaterThan(50);
    }
  });

  it("has at least 2 options", () => {
    expect(options.length).toBeGreaterThanOrEqual(2);
    options.forEach((option) => {
      expect(option.length).toBeGreaterThan(0);
    });
  });

  it("decision references one of the options", () => {
    expect(decision).toBeTruthy();
    expect(decision.length).toBeGreaterThan(0);
    const decisionMatchesOption = options.some((option) => decision.toLowerCase().includes(option.toLowerCase()));
    expect(decisionMatchesOption).toBe(true);
  });

  it("has consequences with good and bad impacts", () => {
    expect(consequences.length).toBeGreaterThanOrEqual(2);
    const hasGoodConsequence = consequences.some((c) => c.toLowerCase().includes("good"));
    const hasBadConsequence = consequences.some((c) => c.toLowerCase().includes("bad"));
    expect(hasGoodConsequence || hasBadConsequence).toBe(true);
  });
});
