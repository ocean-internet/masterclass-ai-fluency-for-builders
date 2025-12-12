import { join } from "node:path";

import { fileURLToPath } from "url";

export const E2E_TEST_TIMEOUT = 120_000;

export const FIXTURES_DIR = join(fileURLToPath(new URL(".", import.meta.url)), "../__fixtures__");
