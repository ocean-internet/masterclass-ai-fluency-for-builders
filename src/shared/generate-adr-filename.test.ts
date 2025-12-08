import { describe, expect, it } from "vitest";

import { generateFilename } from "./generate-adr-filename";

describe("generateAdrFilename", () => {
  it.each([
    ["# Use PostgreSQL\n\nSome content", "0000-use-postgre-sql.md"],
    ["#    The Title With Spaces   \n\nContent", "0000-the-title-with-spaces.md"],
    ["# Use PostgreSQL & MongoDB\n\nContent", "0000-use-postgre-sql-mongo-db.md"],
    ["# Use PostgreSQL 2.0\n\nContent", "0000-use-postgre-sql-2-0.md"],
  ])("converts title to kebab-case filename", (markdown, expected) => {
    expect(generateFilename(markdown)).toBe(expected);
  });

  it.each([["## Not an H1\n\nContent"], [""]])("throws error when no H1 title found", (markdown) => {
    expect(() => generateFilename(markdown)).toThrow("Could not extract title from markdown");
  });
});
