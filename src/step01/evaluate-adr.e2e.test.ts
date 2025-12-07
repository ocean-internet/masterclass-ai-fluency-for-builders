import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { E2E_TEST_TIMEOUT } from "../../vitest.config";
import { evaluateAdr } from "./evaluate-adr";

describe("evaluateAdr E2E", () => {
  it(
    "evaluates ADR end-to-end with Ollama",
    async () => {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const fixturesDir = join(__dirname, "./__fixtures__");
      const adrMarkdown = readFileSync(join(fixturesDir, "example-adr.md"), "utf-8");

      const evalMarkdown = await evaluateAdr(adrMarkdown);

      expect(typeof evalMarkdown).toBe("string");
      expect(evalMarkdown.length).toBeGreaterThan(0);

      expect(evalMarkdown).toContain("ADR Evaluation:");
      expect(evalMarkdown).toContain("## Scores");
      expect(evalMarkdown).toContain("## Comments");
      expect(evalMarkdown).toContain("## Suggestions");
    },
    E2E_TEST_TIMEOUT,
  );
});
