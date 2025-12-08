# AI Fluency for Builders: From Zero to Your First AI-Augmented Tool

## TL;DR

Build a working AI-augmented tool using local LLMs (Ollama + LangChain) to generate and evaluate Architecture Decision Records. Learn the Generate → Evaluate → Iterate pattern that scales to any AI workflow.

## Inspiration

- [Using generative AI as an architect buddy for creating architecture decision records](https://handsonarchitects.com/blog/2025/using-generative-ai-as-architect-buddy-for-adrs/)

## Course details

AI is everywhere – but most teams still struggle to use it in practice. You don't need specialist knowledge to start experimenting.

This course gives you the confidence to build and test a working AI-powered tool, even if your organisation hasn't yet found the "right" use case.

We'll use a straightforward example – documenting software decisions – as the vehicle. Step by step, you'll connect to open models, refine prompts, review outputs, and guide AI towards results you can trust.

By the end, you'll have walked through the full workflow of building with AI – and gained the fluency to explore in your own context.

No prior AI experience required – just curiosity, a decent dev machine, and a working setup (instructions shared in advance).

## Who can benefit

- Developers and technical practitioners curious about AI
- Comfortable with git and reading TypeScript/JavaScript
- Teams that want confidence to explore AI, even without a business case in hand

## What you'll achieve

- How to treat AI as a collaborator, not a magic box
- Plugging open models (ollama + LangChain) into a working scaffold
- Iterating on prompts and fixing failure cases
- Guiding AI reasoning: generating options, weighing trade-offs, reviewing outputs
- Principles you can transfer to docs, testing, support, or other workflows

## Course Structure

- **Step 00: Setup** – Provision and test a local LLM runtime ([STEP_00_SETUP.md](docs/STEP_00_SETUP.md))
- **Step 01: Single Prompt** – Generate an ADR with a single prompt, then evaluate it
- **Step 02: Sequential Chain** – Generate ADRs using sequential chains
- **Step 03: Retrieval-Augmented Generation** – Generate ADRs with retrieval-augmented generation

## Getting Started

1. Follow the setup instructions in [STEP_00_SETUP.md](docs/STEP_00_SETUP.md)
2. Run `yarn test` to verify your environment

## Further Reading

- [Agents: Chip Huyen](https://huyenchip.com/2025/01/07/agents.html)
- [Building effective agents: Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [The DNA of AI Agents – Common Patterns in Recent Design Principles: Cedric Chee](https://cedricchee.com/blog/the-dna-of-ai-agents/)
- [Emerging Patterns in Building GenAI Products: Bharani Subramaniam & Martin Fowler](https://martinfowler.com/articles/gen-ai-patterns/)

### AI Engineering

[![image](https://www.oreilly.com/covers/urn:orm:book:9781098166298/100w/)](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)

> by Chip Huyen
