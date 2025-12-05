import { configDefaults, defineConfig } from "vitest/config";
// import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      // "@module-alias": resolve(__dirname, "./src/module-path"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.{test,spec}.*",
        "**/*.config.*",
      ],
      thresholds: {
        lines: 66,
        functions: 100,
        branches: 100,
        statements: 66,
        autoUpdate: (newThreshold) => Math.floor(newThreshold),
      },
    },
    exclude:
      process.env.VITEST_WATCH === "true"
        ? [...configDefaults.exclude, "**/*.smoke.test.ts"]
        : configDefaults.exclude,
  },
});