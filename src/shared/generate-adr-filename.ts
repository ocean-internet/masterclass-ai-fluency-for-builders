import { kebabCase } from "change-case";

import { extractTitle } from "./extract-title";

export function generateFilename(markdown: string): string {
  const title = extractTitle(markdown);
  if (!title) {
    throw Error(`Could not extract title from markdown: ${markdown}`);
  }

  return `0000-${kebabCase(title)}.md`;
}
