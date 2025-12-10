import globals from "globals";
import tslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import vitest from "eslint-plugin-vitest";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.mts"],
  },
  ...tslint.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: { globals: globals.node },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      complexity: ["error", 20],
      "max-depth": ["error", 4],
      "max-lines": ["error", 300],
      "max-lines-per-function": ["error", 60],
      "max-nested-callbacks": ["error", 10],
      "max-params": ["error", 3],
      "max-statements": ["error", 10],

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "objectLiteralProperty",
          format: null,
        },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,mts,cts}"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      complexity: ["error", 40],
      "max-depth": ["error", 8],
      "max-lines": ["error", 600],
      "max-lines-per-function": ["error", 120],
      "max-nested-callbacks": ["error", 20],
      "max-params": ["error", 6],
      "max-statements": ["error", 20],
    },
  },
  {
    files: ["**/__mocks__/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc", "tsconfig.json"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
    ignores: ["**/adr-template*.md"],
  },
]);
