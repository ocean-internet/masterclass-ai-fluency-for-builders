import { readFileSync } from "node:fs";
import { join } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it } from "vitest";

import { generateContext } from "./generate";

describe("generateContext E2E", () => {
  it(
    "generates context with valid schema given markdown input",
    async () => {
      const contextMarkdown = readFileSync(join(FIXTURES_DIR, "example-context.md"), "utf-8");

      const context = await generateContext(contextMarkdown);

      expect(context.description.length).toBeGreaterThan(0);
      expect(context.drivers.length).toBeGreaterThanOrEqual(1);
    },
    E2E_TEST_TIMEOUT,
  );
});
