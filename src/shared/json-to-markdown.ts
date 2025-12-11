import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import Handlebars from "handlebars";
import { decode } from "html-entities";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templatesDir = join(__dirname, "../templates");

const contextPartialSource = readFileSync(join(templatesDir, "context.partial.hbs"), "utf-8");
const optionsPartialSource = readFileSync(join(templatesDir, "options.partial.hbs"), "utf-8");
const decisionPartialSource = readFileSync(join(templatesDir, "decision.partial.hbs"), "utf-8");

Handlebars.registerPartial("context.partial", contextPartialSource);
Handlebars.registerPartial("options.partial", optionsPartialSource);
Handlebars.registerPartial("decision.partial", decisionPartialSource);

export function jsonToMarkdown<Data>(templateFilename: string, data: Data): string {
  const templatePath = join(templatesDir, templateFilename);
  const templateSource = readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile<Data>(templateSource);
  return decode(template(data)).replace(/\n{3,}/g, "\n\n");
}
