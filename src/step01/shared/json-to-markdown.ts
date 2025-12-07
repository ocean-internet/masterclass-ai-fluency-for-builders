import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import Handlebars from "handlebars";
import { decode } from "html-entities";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templatesDir = join(__dirname, "../templates");

function loadTemplate(filename: string): string {
  const filePath = join(templatesDir, filename);
  return readFileSync(filePath, "utf-8");
}

export function jsonToMarkdown<Data>(templateFilename: string, data: Data): string {
  const templateSource = loadTemplate(templateFilename);
  const template = Handlebars.compile<Data>(templateSource);
  return decode(template(data));
}
