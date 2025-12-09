import { E2E_TEST_TIMEOUT } from "@test-utils/config";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { handleContext } from "./command-context";

describe("handleContext E2E", () => {
  it(
    "generates context and decision drivers end-to-end with Ollama",
    async () => {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const fixturesDir = join(__dirname, "../__fixtures__");
      const contextFile = join(fixturesDir, "example-context.md");

      const result = await handleContext(contextFile);

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^#|##/);
      expect(result.toLowerCase()).toMatch(/context|description|problem/);
    },
    E2E_TEST_TIMEOUT,
  );
});
