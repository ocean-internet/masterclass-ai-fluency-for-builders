import { readFileSync } from "node:fs";
import { join } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it } from "vitest";

import { generateContext } from "../context/generate";
import { generateOptions } from "./generate";

describe("generateOptions E2E", () => {
  it(
    "generates options with valid schema given ADR context",
    async () => {
      const contextMarkdown = readFileSync(join(FIXTURES_DIR, "example-context.md"), "utf-8");
      const context = await generateContext(contextMarkdown);

      const options = await generateOptions(context);

      expect(options).toBeInstanceOf(Array);
      expect(options.length).toBeGreaterThanOrEqual(2);
      expect(options.length).toBeLessThanOrEqual(5);
    },
    E2E_TEST_TIMEOUT,
  );
});
