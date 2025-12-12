import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@test-utils": resolve(__dirname, "./src/test-utils"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "**/*.{test,spec}.*", "**/*.config.*"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // autoUpdate: (newThreshold) => Math.floor(newThreshold),
      },
    },
  },
});
