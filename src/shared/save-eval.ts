import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import { join } from "node:path/posix";

import { env } from "../env";
import { generateFilename } from "./generate-eval-filename";

export function saveEval(adrFilename: string, markdown: string) {
  const evalFilename = generateFilename(basename(adrFilename));
  const filename = join(env.ADR_DRAFTS_DIR, evalFilename);
  writeFileSync(filename, markdown, "utf-8");
  return filename;
}
