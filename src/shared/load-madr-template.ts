import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export function loadMadrTemplate(filename: string): string {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const filePath = join(__dirname, "../../docs/decisions/templates", filename);
  return readFileSync(filePath, "utf-8");
}
