import { existsSync, rmSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";

import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OllamaEmbeddings } from "@langchain/ollama";
import ora, { type Ora } from "ora";

import { env } from "../../env";
import { loadDocuments as _loadDocuments } from "./load-documents";

interface Status {
  exists: boolean;
  path: string;
  lastModified?: Date;
  size?: number;
}

let vectorStorePromise: Promise<FaissStore> | null = null;

const PROGRESS_PAD = 30;

const model = new OllamaEmbeddings({
  model: env.OLLAMA_MODEL_EMBED,
  baseUrl: env.OLLAMA_HOST,
});

const isTestEnvironment = process.env["NODE_ENV"] === "test" || process.env["VITEST"] !== undefined;

export async function buildVectorStore(): Promise<FaissStore> {
  const progress = ora({
    isSilent: isTestEnvironment,
  }).start();

  progress.info("Building vector store:");
  progress.indent = 2;
  return Promise.resolve()
    .then(() => loadDocuments(progress))
    .then((documents) => createVectorStore(documents, model, progress))
    .then((store) => saveVectorStore(store, progress))
    .then((store) => {
      vectorStorePromise = null;
      return store;
    })
    .catch((error) => {
      progress.fail(`Failed to build vector store: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    });
}

export async function getVectorStore(): Promise<FaissStore> {
  switch (true) {
    case vectorStorePromise !== null: // build in progress
      return vectorStorePromise;
    case existsSync(env.RAG_VECTOR_STORE_DIR):
      vectorStorePromise = loadVectorStore();
      break;
    default:
      vectorStorePromise = buildVectorStore();
  }
  return vectorStorePromise;
}

export function getVectorStoreStatus(): Status {
  const exists = existsSync(env.RAG_VECTOR_STORE_DIR);
  const status = {
    exists,
    path: env.RAG_VECTOR_STORE_DIR,
  };

  if (!exists) return status;

  const { mtime: lastModified, size } = statSync(env.RAG_VECTOR_STORE_DIR);
  return {
    ...status,
    lastModified,
    size,
  };
}

export function deleteVectorStore(): void {
  if (!existsSync(env.RAG_VECTOR_STORE_DIR)) return;

  rmSync(env.RAG_VECTOR_STORE_DIR, { recursive: true, force: true });
  vectorStorePromise = null;
}

async function loadDocuments(progress: Ora): Promise<Awaited<ReturnType<typeof _loadDocuments>>> {
  const files = await readdir(env.RAG_SOURCE_PDFS_DIR);
  const pdfCount = files.filter((file) => file.endsWith(".pdf")).length;
  progress.text = `PDFs loading...`.padEnd(PROGRESS_PAD) + `(${pdfCount} files)`;

  const documents = await _loadDocuments();

  progress.succeed(`PDFs loaded`.padEnd(PROGRESS_PAD) + `(${pdfCount} files, ${documents.length} chunks)`);
  return documents;
}

async function createVectorStore(
  documents: Awaited<ReturnType<typeof loadDocuments>>,
  embeddings: OllamaEmbeddings,
  progress: Ora,
): Promise<FaissStore> {
  progress.start(`Vector store loading...`.padEnd(PROGRESS_PAD) + `(${documents.length} chunks)`);

  const vectorStore = await FaissStore.fromDocuments(documents, embeddings);

  progress.succeed(`Vector store loaded`.padEnd(PROGRESS_PAD) + `(${documents.length} chunks)`);
  return vectorStore;
}

async function saveVectorStore(vectorStore: FaissStore, progress: Ora) {
  progress.start("Vector store saving...");

  await vectorStore.save(env.RAG_VECTOR_STORE_DIR);

  progress.succeed("Vector store saved");
  return vectorStore;
}

async function loadVectorStore(): Promise<FaissStore> {
  return FaissStore.load(env.RAG_VECTOR_STORE_DIR, model);
}
