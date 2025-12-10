import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { env } from "../../env";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: env.RAG_CHUNK_SIZE,
  chunkOverlap: env.RAG_CHUNK_OVERLAP,
});

export async function loadDocuments(): Promise<Document[]> {
  const pdfDir = env.RAG_SOURCE_PDFS_DIR;
  const files = await readdir(pdfDir);
  const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

  // Suppress PDF.js warnings during PDF loading (PDF.js uses console.log for warnings)
  const originalLog = console.log;
  console.log = () => {};

  try {
    const documents = await Promise.all(
      pdfFiles.map(async (filename) => {
        const loader = new PDFLoader(join(pdfDir, filename), {
          parsedItemSeparator: "\n",
        });
        const loaded = await loader.load();

        return loaded.map((doc) => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            source: filename,
          },
        }));
      }),
    );

    const flattened = documents.flat();
    return splitter.splitDocuments(flattened);
  } finally {
    console.log = originalLog;
  }
}
