import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import Handlebars from "handlebars";
import { decode } from "html-entities";

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templatesDir = join(__dirname, "../templates");

export function jsonToMarkdown<Data>(templateFilename: string, data: Data): string {
  const templatePath = join(templatesDir, templateFilename);
  const templateSource = readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile<Data>(templateSource);
  return decode(template(data));
}
