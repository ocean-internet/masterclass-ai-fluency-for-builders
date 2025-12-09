import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { evaluateAdr } from "./evaluate-adr";

describe("evaluateAdr E2E", () => {
  it(
    "evaluates ADR end-to-end with Ollama",
    async () => {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const fixturesDir = join(__dirname, "../__fixtures__");
      const adrMarkdown = readFileSync(join(fixturesDir, "example-adr.md"), "utf-8");

      const evalMarkdown = await evaluateAdr(adrMarkdown);

      expect(evalMarkdown).toMatch(/^# ADR Evaluation:/);
      expect(evalMarkdown).toMatch(/## Scores\n\n\| Criterion/);
      expect(evalMarkdown).toMatch(/\| Clear\s+\|\s+[1-5]\s+\|/);
      expect(evalMarkdown).toMatch(/\| Justified\s+\|\s+[1-5]\s+\|/);
      expect(evalMarkdown).toMatch(/\| Comprehensive\s+\|\s+[1-5]\s+\|/);
      expect(evalMarkdown).toMatch(/\| Actionable\s+\|\s+[1-5]\s+\|/);
      expect(evalMarkdown).toMatch(/\| \*\*Average\*\*\s+\|\s+\*\*[0-9]+\.[0-9]+\*\*\s+\|/);
      expect(evalMarkdown).toMatch(/## Comments\n\n.+/);
      expect(evalMarkdown).toMatch(/## Suggestions\n\n/);
    },
    E2E_TEST_TIMEOUT,
  );
});
