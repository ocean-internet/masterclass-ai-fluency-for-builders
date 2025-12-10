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

  // If this is set too high, we get connection refused errors
  RAG_CHUNK_SIZE: z.coerce.number().int().min(100).default(600),
  RAG_CHUNK_OVERLAP: z.coerce.number().int().min(0).default(100),
  RAG_RETRIEVER_K: z.coerce.number().int().min(1).default(5),
  RAG_VECTOR_STORE_DIR: z
    .string()
    .default(".vectorstore")
    .transform((path) => resolve(process.cwd(), path)),
  RAG_SOURCE_PDFS_DIR: z
    .string()
    .default("docs/source-pdfs")
    .transform((path) => resolve(process.cwd(), path)),
});
export const env = envSchema.parse(process.env);
