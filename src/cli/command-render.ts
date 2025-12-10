import { readFileSync } from "node:fs";

import { renderAdr } from "@step02/adr/render-adr";
import { adrDataSchema } from "@step02/adr/schema";

export async function handleRender(adrDataJsonFile: string): Promise<string> {
  const adrDataJson = readFileSync(adrDataJsonFile, "utf-8");
  const adrData = adrDataSchema.parse(JSON.parse(adrDataJson));
  return renderAdr(adrData);
}
