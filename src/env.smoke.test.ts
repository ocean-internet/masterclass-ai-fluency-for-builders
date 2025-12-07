import ollama from "ollama";
import { describe, expect, it } from "vitest";

import { env } from "./env";

const MODEL = env.OLLAMA_MODEL;
const OLLAMA_GENERATE_TIMEOUT = 30_000;

describe("Environment Setup", () => {
  it(
    "should successfully generate text when making LLM call",
    async () => {
      const { response } = await ollama.generate({
        model: MODEL,
        prompt: 'Say "OK',
        stream: false,
        options: {
          temperature: 0,
        },
      });
      expect(response.toLowerCase()).toContain("ok");
    },
    OLLAMA_GENERATE_TIMEOUT,
  );
});
