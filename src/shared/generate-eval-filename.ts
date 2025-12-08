export function generateFilename(adrFilename: string): string {
  const baseName = adrFilename.replace(/\.md$/, "");
  return `${baseName}.eval.md`;
}
