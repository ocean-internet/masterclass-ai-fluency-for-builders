import { resolve } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export const E2E_TEST_TIMEOUT = 60_000;

export default defineConfig({
  resolve: {
    alias: {
      "@cli": resolve(__dirname, "./src/cli"),
      "@step01": resolve(__dirname, "./src/step01"),
      "@step02": resolve(__dirname, "./src/step02"),
      "@shared": resolve(__dirname, "./src/shared"),
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
        statements: 82,
        branches: 62,
        functions: 86,
        lines: 84,
        autoUpdate: (newThreshold) => Math.floor(newThreshold * 0.9),
      },
    },
    exclude:
      process.env.VITEST_WATCH === "true"
        ? [...configDefaults.exclude, "**/*.{e2e,smoke}.test.ts"]
        : configDefaults.exclude,
  },
});
