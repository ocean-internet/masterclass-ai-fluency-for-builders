import { generateAdrData } from "@step02/adr/generate-adr-data";
import { generateContext } from "@step02/context/generate";
import { generateDecision } from "@step02/decision/generate";
import { generateOptions } from "@step02/options/generate";
import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { handleRender } from "./command-render";

describe("handleRender E2E", () => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fixturesDir = join(__dirname, "../__fixtures__");
  let tempAdrDataJsonFile: string;

  it(
    "renders ADR from data end-to-end",
    async () => {
      const contextFile = join(fixturesDir, "example-context.md");
      const contextMarkdown = readFileSync(contextFile, "utf-8");
      const context = await generateContext(contextMarkdown);
      const options = await generateOptions(context);
      const decision = await generateDecision(context, options);
      const adrData = generateAdrData({ context, options, decision });

      tempAdrDataJsonFile = join(fixturesDir, "example-adr-data.json");
      writeFileSync(tempAdrDataJsonFile, JSON.stringify(adrData, null, 2), "utf-8");

      const result = await handleRender(tempAdrDataJsonFile);

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^#\s*/);
      expect(result).toMatch(/##\s*Context and Problem Statement/i);
      expect(result).toMatch(/##\s*Decision Drivers/i);
      expect(result).toMatch(/##\s*Considered Options/i);
      expect(result).toMatch(/##\s*Decision Outcome/i);
    },
    E2E_TEST_TIMEOUT,
  );
});
