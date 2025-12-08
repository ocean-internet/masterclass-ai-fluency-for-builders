export function extractTitle(markdown: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch?.[1]?.trim() ?? "";
}
