import { resolve } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@cli": resolve(__dirname, "./src/cli"),
      "@step01": resolve(__dirname, "./src/step01"),
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
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // autoUpdate: (newThreshold) => Math.floor(newThreshold),
      },
    },
    exclude:
      process.env["VITEST_WATCH"] === "true"
        ? [...configDefaults.exclude, "**/*.{e2e,smoke}.test.ts"]
        : configDefaults.exclude,
  },
});
