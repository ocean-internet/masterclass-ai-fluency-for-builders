import { describe, expect, it } from "vitest";

import { generateFilename } from "./generate-filename";

describe("generateAdrFilename", () => {
  it("extracts title and converts to kebab-case", () => {
    const markdown = "# Use PostgreSQL\n\nSome content";
    const filename = generateFilename(markdown);
    expect(filename).toBe("0000-use-postgre-sql.md");
  });

  it("handles extra whitespace in title", () => {
    const markdown = "#    The Title With Spaces   \n\nContent";
    const filename = generateFilename(markdown);
    expect(filename).toBe("0000-the-title-with-spaces.md");
  });

  it("handles special characters in title", () => {
    const markdown = "# Use PostgreSQL & MongoDB\n\nContent";
    const filename = generateFilename(markdown);
    expect(filename).toBe("0000-use-postgre-sql-mongo-db.md");
  });

  it("handles numbers in title", () => {
    const markdown = "# Use PostgreSQL 2.0\n\nContent";
    const filename = generateFilename(markdown);
    expect(filename).toBe("0000-use-postgre-sql-2-0.md");
  });

  it("throws error if no H1 title found", () => {
    const markdown = "## Not an H1\n\nContent";
    expect(() => generateFilename(markdown)).toThrow("Could not extract title from markdown");
  });

  it("throws error if markdown is empty", () => {
    const markdown = "";
    expect(() => generateFilename(markdown)).toThrow("Could not extract title from markdown");
  });
});
