import ollama from "ollama";
import { describe, expect, it } from "vitest";

import { env } from "./env";
import { E2E_TEST_TIMEOUT } from "./test-utils/config";

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
  ])(`has the required %s model loaded in Ollama`, async (modelName) => {
    const { models } = await ollama.list();
    const names = models.flatMap((model) => [model.name, model.model].filter(Boolean));
    expect(names.some((name) => name.startsWith(modelName))).toBe(true);
  });

  it(
    "successfully generates text response from Ollama model",
    async () => {
      const { response } = await ollama.generate({
        model: env.OLLAMA_MODEL,
        prompt: 'Say "OK',
        stream: false,
        options: {
          temperature: 0,
        },
      });
      expect(response.toLowerCase()).toContain("ok");
    },
    E2E_TEST_TIMEOUT,
  );
});
