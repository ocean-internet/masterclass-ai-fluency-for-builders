import { readFileSync } from "node:fs";
import { join } from "node:path";

import { generateContext } from "@step02/context/generate";
import { E2E_TEST_TIMEOUT, FIXTURES_DIR } from "@test-utils/config";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { retrieveContext } from "../retrieval/retrieve-context";
import { generateOptions } from "./generate";

vi.mock("../retrieval/retrieve-context");

describe("generateOptions E2E", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(retrieveContext).mockResolvedValue("Mocked retrieved context from PDFs");
  });

  it(
    "generates options with valid schema given ADR context and retrieved context",
    async () => {
      const contextMarkdown = readFileSync(join(FIXTURES_DIR, "example-context.md"), "utf-8");
      const context = await generateContext(contextMarkdown);

      const options = await generateOptions(context);

      expect(retrieveContext).toHaveBeenCalled();
      expect(options).instanceOf(Array);
      expect(options.length).toBeGreaterThanOrEqual(2);
    },
    E2E_TEST_TIMEOUT,
  );
});
