# What Next: Continuing Your AI Fluency Journey

You've built a working AI tool. You're not an expert, but you can do it - and you can take it further. The Generate → Evaluate → Iterate pattern you learned scales from Single Prompt → Sequential Chain → RAG. Keep using it.

## Taking Single Prompt Further {#taking-single-prompt-further}

Continue improving your single-prompt approach with these next steps:

- **Experiment with different evaluation criteria** for your use case. Add custom scores (security, performance, maintainability) to match what matters in your domain.
- **Try different models** to compare speed vs quality trade-offs. Smaller models are faster; larger models are more capable. You can use more powerful local models or switch to cloud-based models (OpenAI, Anthropic, AWS Bedrock, etc.) via [LangChain's model integrations](https://docs.langchain.com/oss/javascript/integrations/providers/overview) - the same patterns work across providers.
- **Iterate on prompts using evaluation feedback** - make one change at a time so you can see what actually improves output.

Keep using the Generate → Evaluate → Iterate pattern. Use evaluation scores to guide prompt improvements systematically.

**Reference**: Step 01 code in `src/step01/` and documentation in `docs/STEP_01_SINGLE_PROMPT.md`.

**Learn more**: [learn.deeplearning.ai](https://learn.deeplearning.ai/) for prompt engineering courses, [LangChain documentation](https://docs.langchain.com/oss/javascript/langchain/overview) for advanced prompt patterns.

## Taking Sequential Chain Further {#taking-sequential-chain-further}

Build multi-step chains to handle complex tasks:

- **Break your task into stages** (e.g., context → options → decision). Each stage has its own prompt and validation.
- **Add intermediate validation** between chain stages to catch errors early.
- **Evaluate each stage separately** to identify bottlenecks. Find which stage needs improvement.

Use the same evaluation pattern from Step 01. Evaluate both the final output and intermediate stages to understand where quality degrades.

**Reference**: Step 02 code in `src/step02/` and documentation in `docs/STEP_02_SEQUENTIAL_CHAIN.md`, or [LangChain documentation](https://docs.langchain.com/oss/javascript/langchain/overview) for chain composition (chains are deprecated in v1.0 in favour of Runnables).

**Learn more**: [learn.deeplearning.ai](https://learn.deeplearning.ai/) for advanced chain patterns, [LangChain documentation](https://docs.langchain.com/oss/javascript/langchain/overview) for chain composition.

## Taking RAG Further {#taking-rag-further}

Add retrieval to your prompts for context-aware generation:

- **Load your documents into a vector store** and embed them for semantic search.
- **Retrieve relevant context** for your prompts using top-k or reranking strategies.
- **Evaluate retrieval quality separately** (relevance, coverage) to ensure you're getting the right context.

Evaluate both retrieval quality and final output. Check if retrieved documents are actually used in your generated content.

**Reference**: Step 03 code in `src/step03/` and documentation in `docs/STEP_03_RETRIEVAL_AUGMENTED_GENERATION.md`, or [LangChain RAG documentation](https://docs.langchain.com/oss/javascript/langchain/rag).

**Learn more**: [learn.deeplearning.ai](https://learn.deeplearning.ai/) for RAG courses, [LangChain RAG documentation](https://docs.langchain.com/oss/javascript/langchain/rag) for retrieval strategies.

## Productionising

When moving to production, focus on these essentials:

- **Add error handling**: Retry logic for transient failures, graceful degradation when models fail.
- **Implement observability**: Logging, metrics, and tracing (LangSmith) to monitor quality and performance.
- **Consider cloud LLM platforms** for scale: AWS Bedrock, Azure OpenAI, Google Cloud Vertex AI, or NVIDIA NIM. For workflow automation with LLM integrations, see [n8n.io](https://n8n.io/) (featured in Thoughtworks Tech Radar).

Continue evaluation in production. Monitor evaluation scores over time and use them to track quality.

**Reference**: [LangChain deployment guide](https://docs.langchain.com/oss/javascript/langchain/deploy) and [observability guide](https://docs.langchain.com/oss/javascript/langchain/observability), [LangSmith](https://smith.langchain.com/) for production tracing.

**Learn more**: [learn.deeplearning.ai](https://learn.deeplearning.ai/) for production courses, cloud platform documentation.

## Further Reading/Learning

### Comprehensive Learning

- **[learn.deeplearning.ai](https://learn.deeplearning.ai/)** - Comprehensive AI courses covering all topics

### LangChain Ecosystem

- **[LangSmith](https://smith.langchain.com/)** - Production tracing and monitoring
- **[LangChain Documentation](https://docs.langchain.com/oss/javascript/langchain/overview)** - Complete framework reference
- **LangChain Discord** - Community support

### Cloud LLM Platforms

- **AWS Bedrock** - Managed LLM service on AWS
- **Azure OpenAI** - OpenAI models on Azure
- **Google Cloud Vertex AI** - LLM services on GCP
- **NVIDIA NIM** - Optimized inference microservices

### Workflow Automation Platforms

- **[n8n.io](https://n8n.io/)** - Workflow automation platform with LLM integrations (featured in Thoughtworks Tech Radar)

### Articles & Resources

- [Agents: Chip Huyen](https://huyenchip.com/2025/01/07/agents.html)
- [Building effective agents: Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [The DNA of AI Agents - Common Patterns: Cedric Chee](https://cedricchee.com/blog/the-dna-of-ai-agents/)
- [Emerging Patterns in Building GenAI Products: Martin Fowler](https://martinfowler.com/articles/gen-ai-patterns/)
