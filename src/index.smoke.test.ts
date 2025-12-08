import { join } from "path";
import { fileURLToPath } from "url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

import { existsSync } from "node:fs";

import { E2E_TEST_TIMEOUT } from "./test-utils/config";

describe("index smoke", () => {
  const exitSpy = vi.fn();
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.clearAllMocks();
    originalArgv = process.argv;
    originalExit = process.exit;
    process.exit = exitSpy as never;
    vi.mocked(existsSync).mockReturnValue(false);
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleLogSpy.mockRestore();
  });

  it(
    "executes generate command end-to-end",
    async () => {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const fixturesDir = join(__dirname, "__fixtures__");
      const contextFile = join(fixturesDir, "example-context.md");

      const { main } = await import("./index");
      process.argv = ["node", "index.ts", "generate", contextFile];

      await main();

      expect(consoleLogSpy).toHaveBeenCalledWith("ADR generated successfully!");
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Filename:"));
      expect(exitSpy).toHaveBeenCalledWith(0);
    },
    E2E_TEST_TIMEOUT,
  );

  it(
    "executes evaluate command end-to-end",
    async () => {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const fixturesDir = join(__dirname, "__fixtures__");
      const adrFile = join(fixturesDir, "example-adr.md");

      const { main } = await import("./index");
      process.argv = ["node", "index.ts", "evaluate", adrFile];

      await main();

      expect(consoleLogSpy).toHaveBeenCalledWith("ADR evaluated successfully!");
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Filename:"));
      expect(exitSpy).toHaveBeenCalledWith(0);
    },
    E2E_TEST_TIMEOUT,
  );
});
