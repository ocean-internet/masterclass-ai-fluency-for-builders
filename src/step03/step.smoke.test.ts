import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PROJECT_ROOT = join(__dirname, "../..");
const SOURCE_PDFS_DIR = join(PROJECT_ROOT, "docs/source-pdfs");

describe("Step 03 Prerequisites", () => {
  it("has the docs/source-pdfs/ directory", () => {
    expect(existsSync(SOURCE_PDFS_DIR)).toBe(true);
  });

  it("has at least one PDF file in docs/source-pdfs/", () => {
    expect(existsSync(SOURCE_PDFS_DIR)).toBe(true);
    const files = readdirSync(SOURCE_PDFS_DIR);
    const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"));
    expect(pdfFiles.length).toBeGreaterThan(0);
  });
});

