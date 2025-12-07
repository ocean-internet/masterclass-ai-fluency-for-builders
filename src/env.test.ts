import ollama from "ollama";
import { describe, expect, it } from "vitest";

import { env } from "./env";

const MODEL = env.OLLAMA_MODEL;
const EMBED_MODEL = env.OLLAMA_MODEL_EMBED;

describe("Environment Setup", () => {
  it("connects to the local Ollama server", async () => {
    const response = await ollama.list();
    expect(response).toHaveProperty("models");
    expect(response.models).toBeInstanceOf(Array);
  });

  it(`has the required model loaded (${MODEL})`, async () => {
    const { models } = await ollama.list();
    const names = models.flatMap((model) => [model.name, model.model].filter(Boolean));
    expect(names.some((name) => name.startsWith(MODEL))).toBe(true);
  });

  it(`has the required embed model loaded (${EMBED_MODEL})`, async () => {
    const { models } = await ollama.list();
    const names = models.flatMap((model) => [model.name, model.model].filter(Boolean));
    expect(names.some((name) => name.startsWith(EMBED_MODEL))).toBe(true);
  });
});
