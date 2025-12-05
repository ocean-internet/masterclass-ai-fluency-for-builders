import "dotenv/config";
import * as z from "zod";

// Environment validation
const EnvSchema = z.object({
  OLLAMA_MODEL: z.string(),
  OLLAMA_MODEL_EMBED: z.string(),
  OLLAMA_HOST: z.url().optional(),
});
export const env = EnvSchema.parse(process.env);
