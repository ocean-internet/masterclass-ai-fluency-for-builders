import { generateContext } from "@step02/context/generate";
import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { handleOptions } from "./command-options";

describe("handleOptions E2E", () => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fixturesDir = join(__dirname, "../__fixtures__");
  let tempContextJsonFile: string;

  it(
    "generates options from context end-to-end with Ollama",
    async () => {
      const contextFile = join(fixturesDir, "example-context.md");
      const contextMarkdown = readFileSync(contextFile, "utf-8");
      const context = await generateContext(contextMarkdown);
      tempContextJsonFile = join(fixturesDir, "example-context.json");
      writeFileSync(tempContextJsonFile, JSON.stringify(context, null, 2), "utf-8");

      const result = await handleOptions(tempContextJsonFile);
      const options = JSON.parse(result);

      expect(options).toBeInstanceOf(Array);
      expect(options.length).toBeGreaterThanOrEqual(2);
      options.forEach((option: unknown) => {
        expect(option).toHaveProperty("title");
        expect(option).toHaveProperty("description");
        expect(option).toHaveProperty("arguments");
        expect(Array.isArray((option as { arguments: unknown }).arguments)).toBe(true);
      });
    },
    E2E_TEST_TIMEOUT,
  );
});
