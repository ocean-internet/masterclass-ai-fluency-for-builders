import { join } from "node:path";

import { fileURLToPath } from "url";

export const E2E_TEST_TIMEOUT = 120_000;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const FIXTURES_DIR = join(__dirname, "../__fixtures__");
