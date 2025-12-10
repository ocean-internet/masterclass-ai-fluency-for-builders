import { readFileSync } from "node:fs";
import { join } from "node:path";

import { extractAdrData } from "@step02/adr/extract-adr-data";
import { renderAdr } from "@step02/adr/render-adr";
import { generateContext } from "@step02/context/generate";
import { generateDecision } from "@step02/decision/generate";
import { FIXTURES_DIR } from "@test-utils/config";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateAdr } from "./generate-adr";
import { generateOptions } from "./options/generate";

vi.mock("../step02/context/generate");
vi.mock("./options/generate");
vi.mock("../step02/decision/generate");
vi.mock("../step02/adr/extract-adr-data");
vi.mock("../step02/adr/render-adr");

describe("generateAdr", () => {
  const mockContext = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-context.json"), "utf-8"));
  const mockOptions = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-options.json"), "utf-8"));
  const mockDecision = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-adr-data.json"), "utf-8")).decision;
  const mockAdrData = JSON.parse(readFileSync(join(FIXTURES_DIR, "example-adr-data.json"), "utf-8"));
  const mockRenderedAdr = readFileSync(join(FIXTURES_DIR, "example-adr.md"), "utf-8");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateContext).mockResolvedValue(mockContext);
    vi.mocked(generateOptions).mockResolvedValue(mockOptions);
    vi.mocked(generateDecision).mockResolvedValue(mockDecision);
    vi.mocked(extractAdrData).mockReturnValue(mockAdrData);
    vi.mocked(renderAdr).mockReturnValue(mockRenderedAdr);
  });

  it("orchestrates the chain: context → options → decision → render", async () => {
    const inputContext = "Test context input";
    const result = await generateAdr(inputContext);

    expect(generateContext).toHaveBeenCalledWith(inputContext);
    expect(generateOptions).toHaveBeenCalledWith(mockContext);
    expect(result).toBe(mockRenderedAdr);
  });
});
