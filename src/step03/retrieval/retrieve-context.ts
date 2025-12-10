import { Document } from "@langchain/core/documents";

import { env } from "../../env";
import { getVectorStore } from "./create-vector-store";

const DEFAULT_K = env.RAG_RETRIEVER_K;

export async function retrieveContext(query: string, k = DEFAULT_K): Promise<string> {
  const vectorStore = await getVectorStore();
  const results = await vectorStore.similaritySearch(query, k);

  return results
    .map(({ metadata, pageContent }: Document) => {
      const { source = "unknown", pdf: { info: { Title = "unknown", Author = "unknown" } = {} } = {} } = metadata;
      return `
---
Source: ${source}
Title: ${Title}
Author: ${Author}
---

${pageContent}

---`;
    })
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n");
}
