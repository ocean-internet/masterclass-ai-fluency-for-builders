# Masterclass Project Summary

**Status**: Ready for delivery (all three steps implemented, including Step 03 RAG)  
**Purpose**: Single source of truth for project status, alignment analysis, and action items

---

## Executive Summary

The masterclass is **ready for delivery**. All materials are aligned, consistent, and coherent. The approach balances breadth (all 3 steps) with reduced scope (same evaluation, different generation), creating a confidence-building experience for experienced developers new to AI engineering.

### Current State

**Attendees**: Experienced developers (comfortable with git, TypeScript/JavaScript) who are new to building AI-augmented tools. Per DORA research, 90% likely have used AI tools (Copilot, ChatGPT) but haven't built AI-powered tools themselves.

**Core Approach**: AI engineering is just software engineering - small loops, red-green-refactor, change one thing at a time. All three steps covered with 55 minutes of hands-on prompt experimentation.

**Format**: Follow-along git tutorial (branches per step), 120 minutes total

- Introduction: 10 min
- Level 1: 30 min (15 min hands-on)
- Level 2: 35 min (20 min hands-on)
- Level 3: 35 min (20 min hands-on)
- Wrap-up: 10 min

**Key Features**:

- Same evaluation schema across all steps (reduces cognitive load)
- "Confidence builder, not test" messaging throughout (philosophy, not audience trait)
- Follow-along git workflow (branches per step)
- Transferability exercise integrated
- Technical concepts use proper terminology with brief explanations
- All promo promises addressed

---

## Alignment with Course Promo

| Promo Promise                     | Status | Evidence                                                                                                                                                   |
| --------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "No prior AI experience required" | ✅     | Experienced developers (git, TypeScript). "No prior AI experience" means no AI engineering experience. 90% have used AI tools (Copilot, ChatGPT) per DORA. |
| "Confidence to build"             | ✅     | Hands-on across all 3 levels, "confidence builder" messaging throughout                                                                                    |
| "Iterating on prompts"            | ✅     | 55 min hands-on time (46% of session), explicit prompt engineering guidance                                                                                |
| "Principles you can transfer"     | ✅     | Transferability exercise integrated, examples in wrap-up                                                                                                   |
| "Gain fluency to explore"         | ✅     | All 3 levels covered, comprehensive "What Next" document                                                                                                   |

---

## Core Design Decisions

### Why All Three Steps with Reduced Scope

1. **Confidence Builder**: Hands-on practice across all three levels builds confidence through repetition of the same pattern
2. **Same Evaluation Schema**: Reduces cognitive load - only generation approach changes
3. **Software Engineering Parallel**: Like TDD - same test, different implementations. Familiar pattern reduces anxiety
4. **Promo Promise**: "Gain fluency to explore" - exposure to all three levels shows the pattern scales
5. **Reduced Scope Per Step**: Each step focuses on one new concept (chains, RAG) while reusing evaluation pattern

### DORA Research Alignment

**Strong Alignment**:

- ✅ "Working in small batches" - Generate → Evaluate → Iterate embodies this
- ✅ "Quality foundations" - Zod validation, evaluation schemas
- ✅ "Developer experience" - Local-first, reproducible, clear error messages
- ✅ "Measurement strategy" - Evaluation = measurement of AI output quality

### Testing Strategy

**Tooling Gates**:

- `yarn tidy` runs prettier + ls-lint + eslint --fix + `tsc --noEmit`
- `yarn qa` adds `vitest run --coverage` with thresholds at 80% (lines/funcs/branches/statements)
- Step 00: env smoke test validates environment setup (Ollama connectivity, model availability)

**Test Approach**:

**Rule of Thumb**:

- **Single LLM call** → e2e test (validates real LLM integration with Ollama)
- **Orchestration (RunnablePassthrough, multiple LLM calls)** → unit test with mocks (tests orchestration logic, not LLM behavior)
- **CLI wrappers** → unit test (mock LLM call functions ONLY, not libraries/helpers)
  - Exception: Mock filesystem functions with side effects (e.g., `writeFileSync`)

**E2E Tests (Single LLM Call Functions)**:

- Validate single LLM call components with real Ollama
- Examples: `step01/generate-adr.e2e.test.ts`, `step01/evaluate-adr.e2e.test.ts`, `step02/context/generate.e2e.test.ts`, `step02/options/generate.e2e.test.ts`, `step02/decision/generate.e2e.test.ts`, `step03/options/generate.e2e.test.ts`, `step03/retrieval/retrieve-context.e2e.test.ts`
- These are slower but provide confidence that the system works end-to-end

**Unit Tests (Orchestration & CLI Wrappers)**:

- **Orchestration**: Validate orchestration with all LLM calls mocked (e.g., `step02/generate-adr.test.ts`, `step03/generate-adr.test.ts`). Fast, deterministic, test our orchestration logic, not library behavior.
- **CLI Wrappers**: Test file I/O, JSON parsing, and template rendering with LLM functions mocked (e.g., `cli/command-context.test.ts`, `cli/command-decision.test.ts`). Mock only LLM call functions, not helper functions like `jsonToMarkdown` or `renderAdr`.

**Testing Principles**:

- **Valuable tests over test theatre**: Test behavior, not implementation. Assert observable outcomes rather than internal mechanics.
- **Prefer slower E2E over low-value, heavily mocked tests**: E2E tests with real Ollama provide confidence that the system works end-to-end. Heavy mocking that doesn't validate real behavior adds little value.
- **Maximum value for minimum tests**: Test corner cases and key paths, not every variation/permutation. Focus on what could break or what validates core functionality.
- **Test names accurately describe what is being tested**: Use descriptive names that clearly communicate the test's purpose.
- **DO NOT test library code**: Test our code that uses libraries (zod, langchain, ollama), not the libraries themselves.
- **DO NOT couple tests**: Tests can run in any order. Each test must be independent and set up its own fixtures/mocks.

---

## Risk Mitigation

### Risk: Too Much Theory (DORA Connections)

**Mitigation**: DORA connections are optional. If added, keep brief (1-2 sentences), focus on practical implications, make connections during transitions.

### Risk: Step 02/03 Feel Rushed

**Mitigation**: 35 min per step with 20 min hands-on provides adequate time. Use pre-generated outputs for demos if live runs are slow. Focus on "what's possible" and core pattern.

---

## Success Criteria

After masterclass delivery, attendees should be able to:

1. ✅ Generate structured output with LangChain + Ollama
2. ✅ Evaluate outputs using LLM-as-judge (same schema across all steps)
3. ✅ Iterate on prompts using evaluation feedback
4. ✅ Explain how Generate → Evaluate → Iterate applies to other workflows
5. ✅ Understand that AI engineering is just software engineering (small loops, change one thing at a time)
6. ✅ Feel confident to explore AI in their own context (confidence builder achieved)

---

## Delivery Readiness Checklist

### Pre-Delivery

- [ ] Pre-generate ADR outputs for each level (fallback if live runs are slow)
- [ ] Test all commands on clean machine (Steps 01–03)
- [ ] Verify Ollama setup works
- [ ] Test screen sharing setup
- [ ] Review teaching notes for timing
- [ ] Prepare slides/workflow diagram

### During Delivery

- [ ] Emphasize "confidence builder, not test" in intro
- [ ] Reinforce "AI engineering = software engineering" throughout
- [ ] Allow plenty of time for prompt experimentation (55 min total)
- [ ] Use same evaluation schema across all steps
- [ ] Focus on learning, not perfection
- [ ] Celebrate small improvements

### Post-Delivery

- [ ] Share "What Next" document
- [ ] Collect feedback
- [ ] Update materials based on learnings

---

## Document Status

- ✅ `docs/TEACHING_NOTES.md` - Complete, ready for delivery
- ✅ `docs/WHAT_NEXT.md` - Complete, comprehensive
- ✅ `docs/STEP_00_SETUP.md` - Complete
- ✅ `docs/STEP_01_SINGLE_PROMPT.md` - Complete
- ✅ `docs/STEP_02_SEQUENTIAL_CHAIN.md` - Complete
- ✅ `docs/STEP_03_RETRIEVAL_AUGMENTED_GENERATION.md` - Complete
- ✅ `README.md` - Updated to reflect all 3 steps and follow-along format
- ✅ `docs/PROJECT_SUMMARY.md` - This document

**All documents are aligned, consistent, and ready for masterclass delivery.**
