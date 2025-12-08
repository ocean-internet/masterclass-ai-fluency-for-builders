import ollama from "ollama";
import { describe, expect, it } from "vitest";

import { env } from "./env";

describe("Environment Setup", () => {
  it("connects to the local Ollama server", async () => {
    const response = await ollama.list();
    expect(response).toHaveProperty("models");
    expect(response.models).toBeInstanceOf(Array);
  });

  it.each([
    [env.OLLAMA_MODEL, "main model"],
    [env.OLLAMA_MODEL_JUDGE, "judge model"],
    [env.OLLAMA_MODEL_EMBED, "embed model"],
  ])(`has the required %s loaded`, async (modelName) => {
    const { models } = await ollama.list();
    const names = models.flatMap((model) => [model.name, model.model].filter(Boolean));
    expect(names.some((name) => name.startsWith(modelName))).toBe(true);
  });
});
