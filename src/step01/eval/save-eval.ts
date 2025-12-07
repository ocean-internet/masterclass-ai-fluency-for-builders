import { writeFileSync } from "fs";
import { join } from "path/posix";

import { env } from "../../env";
import { generateFilename } from "./generate-filename";

export function saveEval(adrFilename: string, markdown: string) {
  const evalFilename = generateFilename(adrFilename);
  const filename = join(env.ADR_OUTPUT_DIR, evalFilename);
  writeFileSync(filename, markdown, "utf-8");
  return filename;
}
