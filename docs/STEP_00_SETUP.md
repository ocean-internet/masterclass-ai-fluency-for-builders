# Step 00: Setup

**Branch**: `main`  
**Goal**: provision and test a local LLM runtime in a reproducible way.

---

## ⚡ TL;DR

Install Ollama, pull a small model, set `OLLAMA_MODEL` & `OLLAMA_MODEL_EMBED` in `.env`, install Node/Yarn deps, and run a smoke test that
verifies: (1) the daemon is reachable and (2) the required model is installed.

---

## 🎯 Learning Outcomes

By the end of this step, you will be able to:

- Install and run a local LLM runtime using **Ollama**.
- Execute a **smoke test** (`vitest` + `ollama-js`) that verifies connectivity and that your chosen model is installed.
- Explain why an _offline-first design_ is valuable (reproducibility, latency control, data privacy).

---

## 🧠 Background

**Why this matters:** A reliable local runtime removes "works on my machine" variability and avoids cloud dependencies
during learning.

**Key ideas**

- Same model artefacts for everyone → reproducible outputs
- Lower latency and no API bills
- Inputs/outputs stay on your machine

**Read more:** see Further Reading in [README.md](../README.md).

---

## 🔑 Prerequisites

- **Operating system:** macOS, Linux, or Windows via **WSL2**
- **Tools:** Git, Node LTS, Yarn (via Corepack or global install)
- **Connectivity:** Internet access to download Ollama + model
- **Disk/RAM:** enough for a small instruct model (e.g., `llama3.1:8b`)

---

## 🧭 Walkthrough

This step is all about setup — making sure your environment is ready to run ADR generation locally.

Don't worry if you've never used Ollama or local LLMs before: the checks here are simple, and the tests will confirm
everything is wired up correctly.

**Note:** We'll use two models: a main language model (`OLLAMA_MODEL`) for text generation and an embedding model (`OLLAMA_MODEL_EMBED`) for vector operations. Both are required.

### 1. Install Ollama

#### macOS

Download and install: https://ollama.com/download/mac

#### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

If needed, start the service:

```bash
systemctl --user start ollama
```

#### Windows (via WSL2)

1. Install WSL:
   [https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)
2. Inside WSL (Ubuntu recommended), follow the Linux steps above.

**Expected:** `ollama` is on your PATH.

---

### 2. Ensure the daemon is running

```bash
curl -f http://localhost:11434/api/version
```

**Expected:** Command returns JSON with version info (e.g., `{"version":"0.13.1"}`) and exits with status 0, confirming the daemon is reachable.

---

### 3. Pull a compact model

```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

**Expected:** download completes; `ollama list` shows both `llama3.1:8b` and `nomic-embed-text`.

---

### 4. Configure environment

Copy the example and set your default model:

```bash
cp .env.example .env
```

#### .env

```env
# The local model you expect to be present
OLLAMA_MODEL=llama3.1:8b

# The embedding model for vector operations
OLLAMA_MODEL_EMBED=nomic-embed-text

# Optional: override host (e.g., WSL/remote)
# OLLAMA_HOST=http://127.0.0.1:11434
```

**Expected:** `.env` exists and includes both `OLLAMA_MODEL=llama3.1:8b` and `OLLAMA_MODEL_EMBED=nomic-embed-text` (or your choices).

---

### 5. Set up Node.js, Yarn, and dependencies

Using **nvm** + **Corepack** (recommended):

```bash
nvm install && nvm use   # installs/uses the .nvmrc or latest LTS
corepack enable          # enables Yarn bundled with Node
yarn install             # installs package.json dependencies
```

(If you prefer global Yarn: `npm i -g yarn && yarn`.)

**Expected:** dependencies install successfully.

---

### 6. Run the smoke test

```bash
yarn test
```

**Expected:**

- Tests connect to the Ollama daemon.
- Tests confirm both `OLLAMA_MODEL` and `OLLAMA_MODEL_EMBED` are installed.
- Clear failure messages if any check fails (no side effects).

> Reference test file: `src/env.test.ts`

---

## ✅ Checklist

- ⬜ Ollama installed and running (`curl -f http://localhost:11434/api/version` returns version JSON)
- ⬜ Models pulled (`ollama list` shows both `llama3.1:8b` and `nomic-embed-text`, or your chosen models)
- ⬜ `.env` contains both `OLLAMA_MODEL=llama3.1:8b` and `OLLAMA_MODEL_EMBED=nomic-embed-text` (or your choices)
- ⬜ `yarn install` completes without error
- ⬜ `yarn test` passes (all 4 tests: connectivity + both model presence checks)
- ⬜ I can explain why _offline-first_ matters

---

## 🛠️ Troubleshooting

- **Model won't load** → insufficient RAM/VRAM → try a smaller quantised build (e.g., `llama3.1:8b-instruct:q4_0`).
- **Ollama not reachable** → daemon not running → start with `ollama serve` (foreground) or
  `systemctl --user start ollama` (Linux).
- **WSL networking issues** → set `OLLAMA_HOST=http://127.0.0.1:11434` in `.env`.
- **Node/Yarn issues** → confirm `node -v` (LTS); run `corepack enable` before `yarn install`.

---

## ➡️ Next

With your environment ready, you're set to generate your very first ADR.

Continue to **Step 01 — Single Prompt + Evaluation** ([docs/STEP_01_SINGLE_PROMPT_PLUS_EVAL.md](./STEP_01_SINGLE_PROMPT_PLUS_EVAL.md)).

```bash
git checkout step-01-single-prompt-plus-eval
```
