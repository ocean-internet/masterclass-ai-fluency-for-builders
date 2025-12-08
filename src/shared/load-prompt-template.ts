import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const promptsDir = join(__dirname, "../prompts");

export function loadPromptTemplate(filename: string): string {
  const filePath = join(promptsDir, filename);
  return readFileSync(filePath, "utf-8");
}
