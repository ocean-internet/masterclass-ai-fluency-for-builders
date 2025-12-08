import { extractTitle } from "@shared/extract-title";
import { kebabCase } from "change-case";

export function generateFilename(markdown: string): string {
  const title = extractTitle(markdown);
  if (!title) {
    throw Error(`Could not extract title from markdown: ${markdown}`);
  }
  const filename = `0000-${kebabCase(title)}.md`;
  return filename;
}
