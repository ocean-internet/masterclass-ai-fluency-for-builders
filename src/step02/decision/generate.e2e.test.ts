import { readFileSync } from "node:fs";
import { join } from "node:path";

import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it } from "vitest";

import { type Option } from "../options/schema";
import { generateDecision } from "./generate";

describe("generateDecision E2E", () => {
  it(
    "generates decision with valid schema given context and options",
    async () => {
      const context = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-context.json"), "utf-8"));
      const options = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-options.json"), "utf-8")) as Option[];

      const decision = await generateDecision(context, options);

      expect(options.map((option) => option.title)).toContain(decision.chosenOption);
    },
    E2E_TEST_TIMEOUT,
  );
});
