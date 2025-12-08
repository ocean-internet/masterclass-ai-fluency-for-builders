export function handleError(error: unknown): void {
  const message = error instanceof Error ? error.message : "Error";
  console.error(message);
}
