import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { env } from "../env";
import { generateFilename } from "./generate-adr-filename";

export function saveAdr(markdown: string) {
  const filename = join(env.ADR_DRAFTS_DIR, generateFilename(markdown));
  if (existsSync(filename)) {
    throw new Error(`ADR file already exists: ${filename}`);
  }
  writeFileSync(filename, markdown, "utf-8");
  return filename;
}
