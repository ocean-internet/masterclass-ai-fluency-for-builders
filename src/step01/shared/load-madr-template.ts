import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const madrTemplateDir = join(__dirname, "../../../docs/decisions/templates");

export function loadMadrTemplate(filename: string): string {
  const filePath = join(madrTemplateDir, filename);
  return readFileSync(filePath, "utf-8");
}
