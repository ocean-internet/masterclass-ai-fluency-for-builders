# What Next: Continuing Your AI-Fluency Journey

You've built a working AI tool. You're not an expert, but you can do it–and you can take it further. The Generate → Evaluate → Iterate pattern you learned scales from Single Prompt → Sequential Chain → RAG. Keep using it.

---

## Taking Single Prompt Further

Continue improving your single-prompt approach with these next steps:

- **Experiment with different evaluation criteria** for your use case. Add custom scores (security, performance, maintainability) to match what matters in your domain.
- **Try different models** to compare speed vs quality trade-offs. Smaller models are faster; larger models are more capable.
- **Iterate on prompts using evaluation feedback** – make one change at a time so you can see what actually improves output.

Keep using the Generate → Evaluate → Iterate pattern. Use evaluation scores to guide prompt improvements systematically.

**Production considerations:**

- **Monitoring**: Track evaluation scores over time. Set alerts if scores drop below your "good enough" threshold (e.g., average < 3.5).
- **Observability**: Log prompt versions, evaluation scores, and iteration count to understand what works.
- **Advanced evaluation**: Add custom criteria (security, compliance, domain-specific) beyond the basic 4 scores.
- **When to stop iterating**: Define your "good enough" threshold. Monitor for diminishing returns - if 5 iterations don't improve scores, consider different approaches.

**Reference**: Step 01 code in [src/step01](../src/step01) and documentation in [STEP_01_SINGLE_PROMPT.md](STEP_01_SINGLE_PROMPT.md).

**Learn more**: [DeepLearning.AI: LangChain for LLM Application Development](https://learn.deeplearning.ai/courses/langchain) for prompt engineering courses, [LangChain: Structured Output](https://docs.langchain.com/oss/javascript/langchain/structured-output) for advanced prompt patterns.

---

## Taking Sequential Chain Further

Build multistep chains to handle complex tasks:

- **Break your task into stages** (e.g. context → options → decision). Each stage has its own prompt and validation.
- **Add intermediate validation** between chain stages to catch errors early.
- **Evaluate each stage separately** to identify bottlenecks. Find which stage needs improvement.

Use the same evaluation pattern from Step 01. Evaluate both the final output and intermediate stages to understand where quality degrades.

**Production considerations:**

- **Observability**: Log execution time for each stage. Identify bottlenecks (which stage is slowest?).
- **Error handling**: Add retry logic for failed stages. Don't lose progress if Stage 3 fails after Stages 1-2 succeed.
- **Monitoring**: Track per-stage success rates. Alert if any stage fails >5% of the time.
- **Performance optimisation**: Consider caching intermediate results. Parallelise independent stages when possible.
- **Advanced evaluation**: Evaluate each stage separately to find quality degradation points.

**Reference**: Step 02 code in [src/step02](../src/step02) and documentation in [STEP_02_SEQUENTIAL_CHAIN.md](STEP_02_SEQUENTIAL_CHAIN.md).

**Learn more**: [DeepLearning.AI: Functions, Tools and Agents with LangChain](https://learn.deeplearning.ai/courses/functions-tools-agents-langchain) for advanced chain patterns, [LangChain agents documentation](https://docs.langchain.com/oss/javascript/langchain/agents) and [LangGraph overview](https://docs.langchain.com/oss/javascript/langgraph/overview) for chain composition.

---

## Taking RAG Further

Add retrieval to your prompts for context-aware generation:

- **Load your documents into a vector store** and embed them for semantic search.
- **Retrieve relevant context** for your prompts using top-k or reranking strategies.
- **Evaluate retrieval quality separately** (relevance, coverage) to ensure you're getting the right context.

Evaluate both retrieval quality and final output. Check if retrieved documents are actually used in your generated content.

**Production considerations:**

- **Retrieval quality monitoring**: Log retrieved chunks and their relevance scores. Track if retrieval quality degrades over time.
- **Vector store management**: Automatically rebuild when source documents change. Version your vector stores.
- **Performance optimisation**: Cache frequent queries. Consider reranking for better quality vs speed trade-offs.
- **Tuning guidance**:
  - **k value**: Start with 5, increase if the comprehensive score is low, decrease if the actionable score is low (too much context).
  - **Chunk size**: 600 works for most documents. Smaller (300–400) for dense technical docs, larger (800–1000) for narrative content.
  - **Chunk overlap**: 100 prevents context loss at boundaries. Increase if you notice missing context.
- **Advanced evaluation**: Evaluate retrieval quality separately (are retrieved docs relevant? are they used in output?).

**Reference**: Step 03 code in [src/step03](../src/step03) and documentation in [STEP_03_RETRIEVAL_AUGMENTED_GENERATION.md](STEP_03_RETRIEVAL_AUGMENTED_GENERATION.md).

**Learn more**: [DeepLearning.AI: LangChain Chat with Your Data](https://learn.deeplearning.ai/courses/langchain-chat-with-your-data) for RAG courses, [LangChain retrieval documentation](https://docs.langchain.com/oss/javascript/langchain/retrieval) for retrieval strategies.

---

## Productionising

When moving to production, focus on these essentials:

- **Add error handling**: Retry logic for transient failures, graceful degradation when models fail.
- **Implement observability**: Logging, metrics, and tracing ([LangSmith](https://www.langchain.com/langsmith/observability)) to monitor quality and performance.
- **Consider cloud LLM platforms** for scale: [Amazon Bedrock](https://aws.amazon.com/bedrock/), [Microsoft Foundry](https://azure.microsoft.com/en-us/products/ai-foundry), [Google Vertex AI](https://cloud.google.com/vertex-ai), or [NVIDIA NIM](https://developer.nvidia.com/nim). For workflow automation with LLM integrations, see [n8n.io](https://n8n.io/).

Continue evaluation in production. Monitor evaluation scores over time and use them to track quality.

**Reference**: [LangSmith Deployment](https://docs.langchain.com/oss/javascript/langchain/deploy), [LangSmith Observability](https://docs.langchain.com/oss/javascript/langchain/observability) for production tracing.

**Learn more**: [learn.deeplearning.ai](https://learn.deeplearning.ai/) for production courses.

---

## Further Reading/Learning

### Comprehensive Learning

- **[learn.deeplearning.ai](https://learn.deeplearning.ai/)** – Comprehensive AI courses covering all topics

### LangChain Ecosystem

- **[LangSmith](https://www.langchain.com/langsmith/observability)** – Production tracing and monitoring
- **[LangChain Documentation](https://docs.langchain.com/oss/javascript/langchain/overview)** - Complete framework reference

### Cloud LLM Platforms

- [Amazon Bedrock](https://aws.amazon.com/bedrock/) - Managed LLM service on AWS
- [Microsoft Foundry](https://azure.microsoft.com/en-us/products/ai-foundry) - OpenAI models on Azure
- [Google Vertex AI](https://cloud.google.com/vertex-ai) - LLM services on GCP
- [NVIDIA NIM](https://developer.nvidia.com/nim) – Optimised inference microservices

### Workflow Automation Platforms

- **[n8n.io](https://n8n.io/)** – Workflow automation platform with LLM integrations (featured in Thoughtworks Tech Radar)

### Articles & Resources

- [Agents: Chip Huyen](https://huyenchip.com/2025/01/07/agents.html)
- [Building effective agents: Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [The DNA of AI Agents – Common Patterns: Cedric Chee](https://cedricchee.com/blog/the-dna-of-ai-agents/)
- [Emerging Patterns in Building GenAI Products: Martin Fowler](https://martinfowler.com/articles/gen-ai-patterns/)
