import "dotenv/config";

import * as z from "zod";

const envSchema = z.object({
  OLLAMA_MODEL: z.string(),
  OLLAMA_MODEL_JUDGE: z.string(),
  OLLAMA_MODEL_EMBED: z.string(),
  OLLAMA_HOST: z.url().optional().default("http://127.0.0.1:11434"),

  ADR_OUTPUT_DIR: z.string().default("docs/decisions/drafts"),
});
export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
