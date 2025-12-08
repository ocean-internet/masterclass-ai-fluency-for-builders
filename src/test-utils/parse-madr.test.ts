import { describe, expect, it } from "vitest";

import { loadMadrTemplate } from "../shared/load-madr-template";
import { parseMadr } from "./parse-madr";

describe("parseMadr", () => {
  it.each([["adr-template-minimal.md"], ["adr-template.md"]])(
    "parses %s and extracts all required fields",
    async (templateFile) => {
      const madr = loadMadrTemplate(templateFile);
      const parsed = await parseMadr(madr);

      expect(parsed.title).toBeTruthy();
      expect(parsed.title.length).toBeGreaterThan(0);
      expect(parsed.options.length).toBeGreaterThanOrEqual(2);
      expect(parsed.decision).toBeTruthy();
      expect(parsed.consequences.length).toBeGreaterThanOrEqual(2);
    },
  );
});
