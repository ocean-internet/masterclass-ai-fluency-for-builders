import "dotenv/config";

import { resolve } from "node:path";

import * as z from "zod";

const envSchema = z.object({
  OLLAMA_MODEL: z.string(),
  OLLAMA_MODEL_JUDGE: z.string(),
  OLLAMA_MODEL_EMBED: z.string(),
  OLLAMA_HOST: z.url().optional().default("http://127.0.0.1:11434"),

  ADR_DRAFTS_DIR: z
    .string()
    .default("docs/decisions/drafts")
    .transform((path) => resolve(process.cwd(), path)),
});
export const env = envSchema.parse(process.env);
