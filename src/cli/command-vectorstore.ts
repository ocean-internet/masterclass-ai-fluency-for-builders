import { buildVectorStore, deleteVectorStore, getVectorStoreStatus } from "../step03/retrieval/create-vector-store";

export async function handleVectorStoreBuild(): Promise<string> {
  await buildVectorStore();
  return "Vector store built successfully!";
}

export async function handleVectorStoreStatus(): Promise<string> {
  const status = getVectorStoreStatus();

  if (!status.exists) {
    return "Vector store does not exist.\nRun 'yarn adr vectorstore:build' to create it.";
  }

  const lines = ["Vector store status:", `  Path: ${status.path}`, `  Exists: Yes`];

  if (status.lastModified) {
    lines.push(`  Last modified: ${status.lastModified.toISOString()}`);
  }

  if (status.size !== undefined) {
    lines.push(`  Size: ${(status.size / 1024).toFixed(2)} KB`);
  }

  return lines.join("\n");
}

export async function handleVectorStoreDelete(): Promise<string> {
  const status = getVectorStoreStatus();

  if (!status.exists) {
    return "Vector store does not exist. Nothing to delete.";
  }

  deleteVectorStore();
  return "Vector store deleted successfully!";
}
