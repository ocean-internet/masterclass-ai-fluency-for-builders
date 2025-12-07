import { existsSync, writeFileSync } from "fs";
import { join } from "path/posix";

import { env } from "../../env";
import { generateFilename } from "./generate-filename";

export function saveAdr(markdown: string) {
  const filename = join(env.ADR_OUTPUT_DIR, generateFilename(markdown));
  if (existsSync(filename)) {
    throw new Error(`ADR file already exists: ${filename}`);
  }
  writeFileSync(filename, markdown, "utf-8");
  return filename;
}
