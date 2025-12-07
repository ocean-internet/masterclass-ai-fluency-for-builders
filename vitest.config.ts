import { resolve } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export const E2E_TEST_TIMEOUT = 60_000;

export default defineConfig({
  resolve: {
    alias: {
      "@step01": resolve(__dirname, "./src/step01"),
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
        statements: 70,
        branches: 53,
        functions: 72,
        lines: 72,
        autoUpdate: (newThreshold) => Math.floor(newThreshold * 0.9),
      },
    },
    exclude:
      process.env.VITEST_WATCH === "true"
        ? [...configDefaults.exclude, "**/*.{e2e,smoke}.test.ts"]
        : configDefaults.exclude,
  },
});