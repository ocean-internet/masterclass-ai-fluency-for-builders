import { generateContext } from "@step02/context/generate";
import { generateOptions } from "@step02/options/generate";
import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { handleDecision } from "./command-decision";

describe("handleDecision E2E", () => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fixturesDir = join(__dirname, "../__fixtures__");
  let tempContextJsonFile: string;
  let tempOptionsJsonFile: string;

  it(
    "generates decision from context and options end-to-end with Ollama",
    async () => {
      const contextFile = join(fixturesDir, "example-context.md");
      const contextMarkdown = readFileSync(contextFile, "utf-8");
      const context = await generateContext(contextMarkdown);
      tempContextJsonFile = join(fixturesDir, "example-context.json");
      writeFileSync(tempContextJsonFile, JSON.stringify(context, null, 2), "utf-8");

      const options = await generateOptions(context);
      tempOptionsJsonFile = join(fixturesDir, "example-options.json");
      writeFileSync(tempOptionsJsonFile, JSON.stringify(options, null, 2), "utf-8");

      const result = await handleDecision(tempContextJsonFile, tempOptionsJsonFile);
      const decision = JSON.parse(result);

      expect(decision).toHaveProperty("title");
      expect(decision).toHaveProperty("chosenOption");
      expect(decision).toHaveProperty("justification");
      expect(decision).toHaveProperty("consequences");
      expect(Array.isArray(decision.consequences)).toBe(true);
      expect(decision.consequences.length).toBeGreaterThanOrEqual(2);
    },
    E2E_TEST_TIMEOUT,
  );
});
