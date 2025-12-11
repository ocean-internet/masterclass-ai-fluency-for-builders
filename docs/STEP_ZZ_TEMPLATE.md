# Step {{NN}}: {{Title}}

## ⚡ TL;DR

{{One or two sentences: what you'll build + what you'll learn.}}

## 🚀 Quickstart

> [!NOTE]
> **For Step 00 only:** Include a Quickstart section with numbered links to walkthrough steps.

1. [{{Step 1 description}}](#1-{{step-1-anchor}})
2. [{{Step 2 description}}](#2-{{step-2-anchor}})
3. [{{Step 3 description}}](#3-{{step-3-anchor}})

> **Getting Started**
>
> - Ensure you've completed Step {{NN-1}} - {{Previous Step}} ([STEP*{{NN-1}}*{{PREVIOUS_STEP}}.md](./STEP_{{NN-1}}_{{PREVIOUS_STEP}}.md))
> - Checkout the branch: `git checkout step-{{NN}}-{{slug}}`
> - Run `yarn install` to ensure dependencies are up to date
> - Verify Ollama is running: `curl -f http://localhost:11434/api/version`
> - Verify `.env` is configured with `OLLAMA_MODEL`{{and other required vars}}

## 🎯 Learning Outcomes

By the end of this step, you will be able to:

- {{Outcome 1}}
- {{Outcome 2}}
- {{Outcome 3}}

## 🧠 Background

> [!IMPORTANT]
> **Why this matters:** {{1 short sentence explaining the significance.}}

**Key ideas**

- {{Idea 1}}
- {{Idea 2}}
- {{Constraint or trade-off}}

**Read more:** {{link 1}}, {{link 2}}

## 📊 Workflow Diagram

```mermaid
{{mermaid diagram showing the step workflow}}
```

## 🔑 Prerequisites

> [!TIP]
> **Before starting:** Make sure you have completed all prerequisites to avoid issues during the walkthrough.

- {{Tool/file/model required (e.g., `.env` with `OLLAMA_MODEL=<YOUR_MODEL>`)}}
- {{Dependencies installed (Node LTS, Yarn, etc.)}}
- {{Previous step completed}}

## 🧭 Walkthrough

> [!NOTE]
> {{Optional note about the walkthrough approach or what to expect.}}

### 1. {{Action 1}}

```bash
{{command}}
```

**Expected:** {{exact success signal or file path}}

> [!TIP]
> {{Optional tip for this step}}

### 2. {{Action 2}}

```bash
{{command}}
```

**Expected:** {{exact success signal}}

### 3. {{Action 3}}

```bash
{{command}}
```

**Expected:** {{exact success signal}}

> [!WARNING]
> **Common mistake:** {{Description of a common mistake to avoid}}

## ✅ Checklist

- ⬜ {{Concrete state #1 with verification (e.g., `File exists: docs/decisions/NNNN-*.md` or `Command succeeds: {{command}}`)}}
- ⬜ {{Concrete state #2 with verification (e.g., `Prettier + markdownlint pass` or `Test output shows: {{success signal}}`)}}
- ⬜ {{Quality gate with verification (e.g., `Schema valid; chosenOption ∈ options` or `yarn test` passes all checks)}}
- ⬜ {{ Reflection: one sentence about the key lesson - e.g. I can explain why offline-first matters}}

## ➡️ Next

> [!IMPORTANT]
> **Before moving on:** Complete the checklist above to ensure you're ready for the next step.

```bash
git checkout step-{{NN+1}}-{{next-slug}}
```

Continue to **Step {{NN+1}} - {{Next title}}** ([STEP*{{NN+1}}*{{NEXT_TITLE}}.md](STEP_{{NN+1}}_{{NEXT_TITLE}}.md))

## 🛠️ Troubleshooting

> [!CAUTION]
> **If you encounter issues:** Check the troubleshooting section below before asking for help.

- **{{Symptom}}** → {{Cause}} → **Fix:** `{{command}}`
- **{{Symptom}}** → {{Cause}} → **Fix:** `{{command}}`
