import { readFileSync } from "node:fs";
import { join } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it } from "vitest";

import { evaluateAdr } from "./evaluate-adr";

describe("evaluateAdr E2E", () => {
  it(
    "evaluates ADR end-to-end with Ollama",
    async () => {
      const adrMarkdown = readFileSync(join(FIXTURES_DIR, "example-adr.md"), "utf-8");

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
