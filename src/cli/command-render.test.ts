import { join } from "node:path";

import { FIXTURES_DIR } from "@test-utils/config";
import { describe, expect, it } from "vitest";

import { handleRender } from "./command-render";

describe("handleRender", () => {
  it("reads ADR data file, parses JSON, and renders markdown", async () => {
    const adrDataJsonFile = join(FIXTURES_DIR, "example-adr-data.json");

    const result = await handleRender(adrDataJsonFile);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/^#\s*/);
    expect(result).toMatch(/##\s*Context and Problem Statement/i);
    expect(result).toMatch(/##\s*Decision Drivers/i);
    expect(result).toMatch(/##\s*Considered Options/i);
    expect(result).toMatch(/##\s*Decision Outcome/i);
  });
});
