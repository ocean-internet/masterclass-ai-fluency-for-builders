import "dotenv/config";

import * as z from "zod";

const envSchema = z.object({
  OLLAMA_MODEL: z.string(),
  OLLAMA_MODEL_JUDGE: z.string(),
  OLLAMA_MODEL_EMBED: z.string(),
  OLLAMA_HOST: z.url().optional().default("http://127.0.0.1:11434"),
});
export const env = envSchema.parse(process.env);
