# What Next: Continuing Your AI Fluency Journey

This guide provides practical next steps after completing the masterclass. Each section includes difficulty indicators, time estimates, and specific examples.

---

## Immediate Next Steps (This Week)

**Goal**: Apply what you learned while it's fresh in your mind.

### Apply Pattern to Your Own Use Case

**Difficulty**: Beginner  
**Time**: 2-4 hours  
**Prerequisites**: Completed masterclass, basic understanding of your use case

**Steps:**

1. Identify a simple use case (documentation, test cases, support responses)
2. Create a problem statement (similar to `example-context.md`)
3. Design a Zod schema for your output
4. Write a prompt template
5. Generate output and evaluate it
6. Iterate based on evaluation feedback

**Example**: Generate API documentation from code comments

- Schema: `{ endpoint, method, parameters, response, examples }`
- Prompt: "Generate API documentation from this code..."
- Evaluation: Clarity, completeness, accuracy

### Experiment with Different Evaluation Criteria

**Difficulty**: Beginner  
**Time**: 1-2 hours  
**Prerequisites**: Understanding of evaluation pattern

**Steps:**

1. Identify what matters for your use case
2. Add custom evaluation criteria to schema
3. Update evaluation prompt with new rubric
4. Compare scores across different criteria

**Example**: For code review assistance, add:

- `securityScore`: Checks for security issues
- `performanceScore`: Identifies performance concerns
- `maintainabilityScore`: Assesses code maintainability

### Try Different Models

**Difficulty**: Beginner  
**Time**: 1 hour  
**Prerequisites**: Ollama installed, multiple models pulled

**Steps:**

1. Pull different models: `ollama pull llama3.2:3b`, `ollama pull mistral:7b`
2. Update `.env` with different `OLLAMA_MODEL`
3. Regenerate same prompt with different models
4. Compare outputs and evaluation scores

**Insight**: Smaller models are faster but may have lower quality. Larger models are slower but more capable.

### Iterate on Prompts Using Evaluation Feedback

**Difficulty**: Beginner  
**Time**: 2-3 hours  
**Prerequisites**: Understanding of prompt engineering basics

**Steps:**

1. Generate initial output
2. Evaluate and identify lowest-scoring criteria
3. Modify prompt to address that criteria
4. Regenerate and re-evaluate
5. Compare before/after scores
6. Repeat until scores meet your threshold

**Key Principle**: Make one change at a time. This lets you see which modifications actually improve output.

---

## Deepen Your Understanding

### Advanced Prompt Engineering Techniques

**Difficulty**: Intermediate  
**Time**: 4-6 hours  
**Prerequisites**: Comfortable with basic prompts

**Topics:**

- **Few-shot learning**: Provide examples in prompt
- **Chain-of-thought**: Ask model to show reasoning
- **Role-playing**: Assign specific roles to model
- **Constraint specification**: Explicitly state what not to do
- **Output formatting**: Control structure and style

**Resources:**

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

**Practice Exercise:**
Modify the ADR prompt to use few-shot learning. Include 2-3 example ADRs in the prompt and compare output quality.

### Evaluation Strategies

**Difficulty**: Intermediate  
**Time**: 3-4 hours  
**Prerequisites**: Understanding of basic evaluation

**Topics:**

- **Multi-criteria evaluation**: Evaluate on multiple dimensions
- **Human-in-loop**: Combine AI and human evaluation
- **Comparative evaluation**: Compare multiple outputs
- **A/B testing**: Test different prompts systematically
- **Evaluation metrics**: Define success criteria

**Example: Multi-Criteria Evaluation**

```typescript
const evalSchema = z.object({
  clarity: z.number().min(1).max(5),
  accuracy: z.number().min(1).max(5),
  completeness: z.number().min(1).max(5),
  relevance: z.number().min(1).max(5),
  // ... more criteria
});
```

**Practice Exercise:**
Create an evaluation schema with 5+ criteria specific to your use case. Run evaluation and analyze which criteria correlate with human judgment.

### Schema Design Best Practices

**Difficulty**: Intermediate  
**Time**: 2-3 hours  
**Prerequisites**: Understanding of Zod schemas

**Topics:**

- **Nested structures**: Organize complex data
- **Optional vs required**: Balance flexibility and validation
- **Descriptive fields**: Help LLM understand expectations
- **Validation rules**: Catch errors early
- **Type inference**: Leverage TypeScript types

**Example: Nested Schema**

```typescript
const adrSchema = z.object({
  title: z.string().trim().min(10).max(100),
  context: z.object({
    problem: z.string(),
    drivers: z.array(z.string()),
    constraints: z.array(z.string()).optional(),
  }),
  options: z
    .array(
      z.object({
        name: z.string(),
        pros: z.array(z.string()),
        cons: z.array(z.string()),
      }),
    )
    .min(2),
  // ... more fields
});
```

**Practice Exercise:**
Redesign the ADR schema to be more granular. Add nested structures for better validation and LLM guidance.

### Model Selection Guidance

**Difficulty**: Intermediate  
**Time**: 2-3 hours  
**Prerequisites**: Understanding of model trade-offs

**Topics:**

- **Model size**: Larger = better quality, slower, more memory
- **Quantization**: Smaller file size, slightly lower quality
- **Specialized models**: Fine-tuned for specific tasks
- **Cost vs quality**: Balance for your use case
- **Latency requirements**: Real-time vs batch processing

**Decision Framework:**

- **Speed critical?** → Smaller model (3b-7b parameters)
- **Quality critical?** → Larger model (13b+ parameters)
- **Specialized task?** → Fine-tuned model
- **Budget constrained?** → Smaller quantized model

**Practice Exercise:**
Benchmark 3 different models on the same prompt. Compare: generation time, output quality, evaluation scores.

---

## Engineering Improvements

These improvements address system-level concerns that prevent individual productivity gains from scaling to organizational value. Based on DORA research showing that system bottlenecks absorb individual AI productivity gains.

### Error Handling

**Difficulty**: Intermediate  
**Time**: 3-4 hours  
**Prerequisites**: Understanding of async/await, error handling

**Why it matters**: DORA research shows that system instability increases when individual productivity soars. Robust error handling prevents failures from cascading.

#### Retry Logic for Transient Ollama Failures

**Implementation:**

```typescript
import { RunnableRetry } from "@langchain/core/runnables";

const model = new ChatOllama({
  model: env.OLLAMA_MODEL,
  baseUrl: env.OLLAMA_HOST,
  temperature: 0,
});

const retryModel = RunnableRetry.from(model, {
  maxAttempts: 3,
  delay: 1000, // 1 second between retries
  backoff: "exponential", // exponential backoff
});

// Use retryModel instead of model
const chain = ChatPromptTemplate.fromMessages([...])
  .pipe(retryModel.withStructuredOutput(adrSchema));
```

**Benefits:**

- Handles transient network errors
- Exponential backoff prevents overwhelming server
- Configurable retry attempts

#### Better Error Messages for Schema Validation Failures

**Implementation:**

```typescript
import { ZodError } from "zod";

try {
  const adr = adrSchema.parse(llmOutput);
} catch (error) {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      received: issue.code === "invalid_type" ? issue.received : undefined,
    }));

    console.error("Validation failed:", {
      issues,
      prompt: "Check prompt template matches schema",
      example: "See src/step01/adr/schema.ts",
    });
  }
  throw error;
}
```

**Benefits:**

- Clear error messages help debug quickly
- Points to specific fields that failed
- Suggests fixes

#### Handling Partial/Malformed LLM Responses

**Implementation:**

```typescript
async function generateWithFallback(context: string): Promise<string> {
  try {
    return await generateAdr(context);
  } catch (error) {
    if (error instanceof ZodError) {
      // Try to repair partial JSON
      const repaired = attemptJsonRepair(llmOutput);
      if (repaired) {
        return await generateAdr(context); // Retry with repaired JSON
      }
    }

    // Fallback: Return template with error message
    return generateFallbackAdr(context, error);
  }
}

function attemptJsonRepair(json: string): object | null {
  // Try common JSON repair strategies:
  // 1. Add missing closing braces
  // 2. Fix trailing commas
  // 3. Escape unescaped quotes
  // Use a library like json-repair or implement custom logic
}
```

**Benefits:**

- Graceful degradation instead of complete failure
- Attempts to recover from common errors
- Provides fallback output

#### Graceful Degradation Strategies

**Implementation:**

```typescript
async function generateWithDegradation(context: string): Promise<string> {
  // Try full generation first
  try {
    return await generateAdr(context);
  } catch (error) {
    // Fallback 1: Try with simpler schema
    try {
      return await generateAdrSimple(context);
    } catch (error) {
      // Fallback 2: Return template-based output
      return generateTemplateAdr(context);
    }
  }
}
```

**Benefits:**

- System continues operating even with failures
- Multiple fallback levels
- User always gets some output

---

### LangChain Patterns

**Difficulty**: Intermediate to Advanced  
**Time**: 4-6 hours  
**Prerequisites**: Understanding of LangChain basics

**Why it matters**: DORA emphasizes "quality internal platforms." Reusable LangChain patterns reduce cognitive load and improve consistency.

#### RunnableRetry for Resilience

**Implementation:**

```typescript
import { RunnableRetry } from "@langchain/core/runnables";

const resilientChain = RunnableRetry.from(
  ChatPromptTemplate.fromMessages([...])
    .pipe(model.withStructuredOutput(adrSchema)),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: "exponential",
    onFailedAttempt: (error) => {
      console.warn(`Attempt failed: ${error.message}`);
    },
  }
);
```

**Use cases:**

- Network requests
- Rate-limited APIs
- Unreliable model providers

#### RunnableConfig for Passing Metadata

**Implementation:**

```typescript
import { RunnableConfig } from "@langchain/core/runnables/types";

const config: RunnableConfig = {
  metadata: {
    requestId: crypto.randomUUID(),
    userId: "user123",
    timestamp: Date.now(),
  },
  tags: ["adr-generation", "production"],
};

const result = await chain.invoke({ context }, config);

// Access metadata in callbacks or middleware
```

**Use cases:**

- Request tracing
- User context
- Environment tags
- Debugging

#### Streaming for Long Outputs

**Implementation:**

```typescript
const stream = await chain.stream({ context });

for await (const chunk of stream) {
  // Process chunk incrementally
  console.log(chunk);
  // Update UI, save progress, etc.
}
```

**Use cases:**

- Long-form content generation
- Real-time UI updates
- Progress indicators
- Early cancellation

#### Chain Composition Best Practices

**Implementation:**

```typescript
// Compose multiple chains
const contextChain = ChatPromptTemplate.fromTemplate("...").pipe(model);

const optionsChain = ChatPromptTemplate.fromTemplate("...").pipe(model);

const decisionChain = ChatPromptTemplate.fromTemplate("...").pipe(model);

// Sequential composition
const fullChain = contextChain
  .pipe((output) => optionsChain.invoke({ context: output }))
  .pipe((output) => decisionChain.invoke({ context: output, options: output }));
```

**Best practices:**

- Keep chains focused (single responsibility)
- Use intermediate validation
- Handle errors between stages
- Log intermediate outputs for debugging

#### Custom Runnables and Transformations

**Implementation:**

```typescript
import { RunnableLambda } from "@langchain/core/runnables";

const validateChain = RunnableLambda.from((input: Adr) => {
  // Custom validation logic
  if (input.options.length < 2) {
    throw new Error("Must have at least 2 options");
  }
  return input;
});

const chain = ChatPromptTemplate.fromMessages([...])
  .pipe(model.withStructuredOutput(adrSchema))
  .pipe(validateChain)
  .pipe(jsonToMarkdown);
```

**Use cases:**

- Custom business logic
- Data transformation
- Additional validation
- Format conversion

---

### Observability

**Difficulty**: Intermediate to Advanced  
**Time**: 4-6 hours  
**Prerequisites**: Understanding of logging, metrics, tracing

**Why it matters**: DORA emphasizes "measurement strategy." Observability lets you measure the entire value stream, not just individual productivity.

#### Logging for LLM Calls

**Implementation:**

```typescript
import { logger } from "./logger";

async function generateAdrWithLogging(context: string): Promise<string> {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  logger.info("ADR generation started", {
    requestId,
    contextLength: context.length,
    model: env.OLLAMA_MODEL,
  });

  try {
    const result = await generateAdr(context);
    const duration = Date.now() - startTime;

    logger.info("ADR generation succeeded", {
      requestId,
      duration,
      outputLength: result.length,
    });

    return result;
  } catch (error) {
    logger.error("ADR generation failed", {
      requestId,
      error: error.message,
      duration: Date.now() - startTime,
    });
    throw error;
  }
}
```

**What to log:**

- Input parameters (sanitized)
- Output length/structure
- Generation time
- Model used
- Success/failure
- Error messages

#### Tracing for Debugging Chains

**Implementation:**

```typescript
import { trace } from "@langchain/core/tracers/console";

const chain = ChatPromptTemplate.fromMessages([...])
  .pipe(model.withStructuredOutput(adrSchema))
  .pipe(jsonToMarkdown);

// Enable tracing
const result = await chain.invoke(
  { context },
  {
    callbacks: [trace()],
  }
);
```

**Advanced tracing:**

- Use LangSmith for production tracing
- Track token usage per stage
- Monitor latency per stage
- Identify bottlenecks

#### Metrics Collection

**Implementation:**

```typescript
import { metrics } from "./metrics";

async function generateAdrWithMetrics(context: string): Promise<string> {
  const timer = metrics.startTimer("adr_generation_duration");

  try {
    const result = await generateAdr(context);

    metrics.increment("adr_generation_success");
    metrics.histogram("adr_output_length", result.length);

    return result;
  } catch (error) {
    metrics.increment("adr_generation_failure");
    throw error;
  } finally {
    timer.stop();
  }
}
```

**Metrics to track:**

- Generation time (p50, p95, p99)
- Success rate
- Token usage
- Output length
- Evaluation scores
- Error rates by type

#### Error Tracking and Alerting

**Implementation:**

```typescript
import { Sentry } from "@sentry/node";

async function generateAdrWithErrorTracking(context: string): Promise<string> {
  try {
    return await generateAdr(context);
  } catch (error) {
    // Track error with context
    Sentry.captureException(error, {
      tags: {
        component: "adr-generation",
        model: env.OLLAMA_MODEL,
      },
      extra: {
        contextLength: context.length,
      },
    });

    // Alert on critical errors
    if (error instanceof ZodError) {
      // Schema validation errors are expected, don't alert
    } else {
      // Network errors, model errors - alert
      alerting.sendAlert({
        severity: "high",
        message: `ADR generation failed: ${error.message}`,
      });
    }

    throw error;
  }
}
```

**Alerting thresholds:**

- Error rate > 5%
- Generation time > 30 seconds
- Evaluation scores < 3.0
- Token usage spikes

---

## Extend the Pattern

### Multi-Step Chains (Step 02 Deep Dive)

**Difficulty**: Intermediate  
**Time**: 6-8 hours  
**Prerequisites**: Understanding of LangChain chains, Step 01 mastery

**What you'll learn:**

- Breaking complex tasks into stages
- Intermediate validation
- Error handling between stages
- Conditional chain flows

**Resources:**

- `docs/STEP_02_CHAIN_EVAL.md` (when available)
- [LangChain Chains Documentation](https://js.langchain.com/docs/modules/chains/)

**Practice Exercise:**
Build a chain that generates ADRs in stages:

1. Analyze context → extract problem, drivers, constraints
2. Generate options → list viable alternatives
3. Analyze tradeoffs → compare options
4. Make decision → choose option with justification
5. Generate consequences → list impacts

#### Advanced: Per-Step Evaluation for Chains

**Difficulty**: Advanced  
**Time**: 4-6 hours  
**Prerequisites**: Completed Step 02, understanding of evaluation patterns

**What you'll learn:**

- Evaluating each chain stage separately
- Identifying which stage needs improvement
- Stage-specific evaluation criteria
- Using stage evaluations to guide refinement

**Why it matters**: During the masterclass, we evaluated the final chain output. But you can also evaluate each stage separately to identify bottlenecks.

**Implementation:**

```typescript
// Evaluate each stage output
const contextEval = await evaluateStage(contextOutput, "context");
const optionsEval = await evaluateStage(optionsOutput, "options");
const tradeoffsEval = await evaluateStage(tradeoffsOutput, "tradeoffs");
const decisionEval = await evaluateStage(decisionOutput, "decision");

// Identify weakest stage
const stageScores = {
  context: contextEval.average,
  options: optionsEval.average,
  tradeoffs: tradeoffsEval.average,
  decision: decisionEval.average,
};

const weakestStage = Object.entries(stageScores).sort(([, a], [, b]) => a - b)[0][0];
```

**Practice Exercise:**

1. Build a chain with 3-5 stages
2. Create evaluation schemas for each stage
3. Evaluate each stage separately
4. Identify which stage has the lowest score
5. Improve that stage's prompt
6. Re-run and compare stage scores

**Benefits:**

- Pinpoint exactly where quality degrades
- Focus improvement efforts on weakest stage
- Understand how stage quality affects final output

### Retrieval-Augmented Generation (Step 03 Deep Dive)

**Difficulty**: Advanced  
**Time**: 8-10 hours  
**Prerequisites**: Understanding of embeddings, vector stores, Step 01 mastery

**What you'll learn:**

- Embedding models and vector stores
- Retrieval strategies (top-k, reranking)
- Prompt augmentation with retrieved context
- Context-aware evaluation

**Resources:**

- `docs/STEP_03_RAG_EVAL.md` (when available)
- [LangChain RAG Documentation](https://js.langchain.com/docs/use_cases/question_answering/)

**Practice Exercise:**
Build a RAG system for ADR generation:

1. Load internal architecture documents
2. Embed documents into vector store
3. Retrieve relevant documents for decision context
4. Augment prompt with retrieved context
5. Generate ADR with citations
6. Evaluate context usage

#### Advanced: Retrieval Quality Evaluation

**Difficulty**: Advanced  
**Time**: 4-6 hours  
**Prerequisites**: Completed Step 03, understanding of evaluation patterns

**What you'll learn:**

- Evaluating retrieval relevance
- Checking if retrieved documents are actually used
- Measuring retrieval precision and recall
- Using retrieval evaluation to improve RAG

**Why it matters**: During the masterclass, we focused on improving Step 01 evaluation scores. But you can also evaluate retrieval quality separately to ensure you're getting the right context.

**Implementation:**

```typescript
// Evaluate retrieval quality
const retrievalEval = {
  relevance: evaluateRelevance(query, retrievedDocs),
  coverage: evaluateCoverage(query, retrievedDocs),
  usage: evaluateUsage(retrievedDocs, generatedAdr),
};

// Check if retrieved docs are actually used
function evaluateUsage(retrievedDocs: Document[], adr: string): number {
  let usedCount = 0;
  for (const doc of retrievedDocs) {
    // Check if ADR references or uses information from doc
    if (adr.includes(doc.content.substring(0, 50))) {
      usedCount++;
    }
  }
  return usedCount / retrievedDocs.length;
}
```

**Practice Exercise:**

1. Build a RAG system
2. Create evaluation for retrieval relevance
3. Check if retrieved documents are actually used in output
4. Measure precision (relevant docs retrieved) and recall (all relevant docs found)
5. Adjust retrieval parameters (top-k, similarity threshold)
6. Compare retrieval quality before/after

**Evaluation Criteria:**

- **Relevance**: Are retrieved documents actually relevant to the query?
- **Coverage**: Do retrieved documents cover all aspects of the query?
- **Usage**: Does the generated output actually use retrieved information?
- **Precision**: What percentage of retrieved docs are relevant?
- **Recall**: What percentage of relevant docs were retrieved?

**Benefits:**

- Identify retrieval issues before they affect output quality
- Optimize retrieval parameters based on data
- Understand relationship between retrieval quality and final scores

### Agent Patterns

**Difficulty**: Advanced  
**Time**: 10+ hours  
**Prerequisites**: Understanding of chains, RAG, tool use

**What you'll learn:**

- Tool calling and function execution
- Agent reasoning loops
- Memory and state management
- Multi-agent systems

**Resources:**

- [LangChain Agents Documentation](https://js.langchain.com/docs/modules/agents/)
- [Anthropic Tool Use Guide](https://docs.anthropic.com/claude/docs/tool-use)

**Practice Exercise:**
Build an agent that generates ADRs by:

1. Searching internal documentation
2. Querying team knowledge base
3. Analyzing codebase for context
4. Generating ADR with evidence
5. Reviewing and iterating

### Streaming Outputs

**Difficulty**: Intermediate  
**Time**: 3-4 hours  
**Prerequisites**: Understanding of async streams

**What you'll learn:**

- Streaming LLM responses
- Real-time UI updates
- Progress indicators
- Early cancellation

**Implementation:**

```typescript
const stream = await model.stream("Generate an ADR...");

for await (const chunk of stream) {
  // Update UI incrementally
  updateUI(chunk);
}
```

### Batch Processing

**Difficulty**: Intermediate  
**Time**: 4-5 hours  
**Prerequisites**: Understanding of async/await, concurrency

**What you'll learn:**

- Processing multiple inputs in parallel
- Rate limiting and backpressure
- Error handling in batch contexts
- Progress tracking

**Implementation:**

```typescript
async function generateAdrsBatch(contexts: string[]): Promise<string[]> {
  const batchSize = 5; // Process 5 at a time
  const results: string[] = [];

  for (let i = 0; i < contexts.length; i += batchSize) {
    const batch = contexts.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((context) => generateAdr(context)));
    results.push(...batchResults);
  }

  return results;
}
```

---

## Project Ideas

Each project applies the Generate → Evaluate → Iterate pattern. Start with a simple version, then iterate based on evaluation feedback.

### Documentation Generation

**Difficulty**: Beginner to Intermediate  
**Time**: 4-6 hours  
**Pattern**: Generate API docs from code → Evaluate completeness → Iterate on prompt

**Schema Example:**

```typescript
const apiDocSchema = z.object({
  endpoint: z.string(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  parameters: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string(),
    }),
  ),
  response: z.object({
    status: z.number(),
    body: z.string(),
  }),
  examples: z.array(z.string()),
});
```

**Evaluation Criteria:**

- Completeness: All endpoints documented?
- Accuracy: Examples work?
- Clarity: Easy to understand?

### Code Review Assistance

**Difficulty**: Intermediate  
**Time**: 6-8 hours  
**Pattern**: Generate review comments → Evaluate relevance → Iterate on criteria

**Schema Example:**

```typescript
const reviewSchema = z.object({
  issues: z.array(
    z.object({
      severity: z.enum(["critical", "major", "minor"]),
      category: z.enum(["security", "performance", "maintainability", "style"]),
      location: z.string(),
      description: z.string(),
      suggestion: z.string(),
    }),
  ),
  positives: z.array(z.string()),
  overall: z.string(),
});
```

**Evaluation Criteria:**

- Relevance: Comments address real issues?
- Actionability: Suggestions are implementable?
- Balance: Includes positives, not just negatives?

### Test Case Generation

**Difficulty**: Intermediate  
**Time**: 6-8 hours  
**Pattern**: Generate test cases → Evaluate coverage → Iterate on test types

**Schema Example:**

```typescript
const testCaseSchema = z.object({
  testCases: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      input: z.record(z.any()),
      expectedOutput: z.any(),
      edgeCases: z.array(z.string()).optional(),
    }),
  ),
  coverage: z.object({
    happyPath: z.boolean(),
    edgeCases: z.boolean(),
    errorCases: z.boolean(),
  }),
});
```

**Evaluation Criteria:**

- Coverage: All code paths tested?
- Quality: Tests are meaningful?
- Maintainability: Tests are readable?

### Support Ticket Triage

**Difficulty**: Intermediate  
**Time**: 6-8 hours  
**Pattern**: Generate triage analysis → Evaluate accuracy → Iterate on categories

**Schema Example:**

```typescript
const triageSchema = z.object({
  category: z.enum(["bug", "feature", "question", "documentation"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  summary: z.string(),
  suggestedAssignee: z.string().optional(),
  relatedTickets: z.array(z.string()).optional(),
});
```

**Evaluation Criteria:**

- Accuracy: Category and priority correct?
- Usefulness: Summary helps assignee?
- Efficiency: Reduces manual triage time?

### Meeting Notes Summarization

**Difficulty**: Beginner to Intermediate  
**Time**: 4-6 hours  
**Pattern**: Generate summary → Evaluate completeness → Iterate on format

**Schema Example:**

```typescript
const meetingSummarySchema = z.object({
  title: z.string(),
  date: z.string(),
  attendees: z.array(z.string()),
  agenda: z.array(z.string()),
  decisions: z.array(
    z.object({
      topic: z.string(),
      decision: z.string(),
      actionItems: z.array(z.string()),
    }),
  ),
  nextSteps: z.array(z.string()),
});
```

**Evaluation Criteria:**

- Completeness: All decisions captured?
- Clarity: Action items are clear?
- Accuracy: Summary matches meeting?

### Technical Writing Assistance

**Difficulty**: Intermediate  
**Time**: 6-8 hours  
**Pattern**: Generate documentation → Evaluate clarity → Iterate on style

**Schema Example:**

```typescript
const docSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
      codeExamples: z.array(z.string()).optional(),
    }),
  ),
  conclusion: z.string(),
});
```

**Evaluation Criteria:**

- Clarity: Easy to understand?
- Completeness: Covers all topics?
- Accuracy: Information is correct?

---

## Resources

### Books

**AI Engineering** by Chip Huyen

- Comprehensive guide to building AI systems
- Covers evaluation, monitoring, and production considerations
- [O'Reilly](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)

### Articles

**From README:**

- [Agents: Chip Huyen](https://huyenchip.com/2025/01/07/agents.html) - Understanding AI agents
- [Building effective agents: Anthropic](https://www.anthropic.com/engineering/building-effective-agents) - Agent design principles
- [The DNA of AI Agents - Common Patterns: Cedric Chee](https://cedricchee.com/blog/the-dna-of-ai-agents/) - Agent patterns
- [Emerging Patterns in Building GenAI Products: Martin Fowler](https://martinfowler.com/articles/gen-ai-patterns/) - GenAI patterns

**Additional:**

- [DORA 2025 Report: State of AI-assisted Software Development](https://dora.dev/) - Research on AI in software development
- [LangChain Documentation](https://js.langchain.com/) - Comprehensive LangChain guide
- [Prompt Engineering Guide](https://www.promptingguide.ai/) - Prompt engineering techniques

### Communities

- **LangChain Discord**: Real-time help and discussions
- **AI Engineering Forums**: Community discussions
- **r/LangChain**: Reddit community
- **Stack Overflow**: Tag `langchain` for questions

### Tools to Explore

**Development:**

- **LangSmith**: Production tracing and monitoring
- **Weights & Biases**: Experiment tracking
- **PromptLayer**: Prompt versioning and analytics

**Evaluation:**

- **LangSmith Evals**: Built-in evaluation tools
- **RAGAS**: RAG evaluation framework
- **TruLens**: LLM evaluation library

**Infrastructure:**

- **Ollama**: Local LLM runtime (already using)
- **Chroma**: Vector database
- **Pinecone**: Managed vector database

---

## Advanced Topics

### Fine-tuning vs Prompting

**Difficulty**: Advanced  
**Time**: 10+ hours  
**Prerequisites**: Understanding of model training, datasets

**When to fine-tune:**

- Need domain-specific knowledge
- Prompt engineering reaches limits
- Have large, high-quality dataset
- Cost of fine-tuning < cost of long prompts

**When to use prompting:**

- General tasks
- Rapid iteration needed
- Limited training data
- Need flexibility

**Resources:**

- [Hugging Face Fine-tuning Guide](https://huggingface.co/docs/transformers/training)
- [OpenAI Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)

### Evaluation Metrics and Benchmarking

**Difficulty**: Advanced  
**Time**: 8-10 hours  
**Prerequisites**: Understanding of evaluation, statistics

**Topics:**

- Human evaluation vs automated
- Inter-annotator agreement
- Benchmark datasets
- Statistical significance
- A/B testing frameworks

**Resources:**

- [HELM: Holistic Evaluation of Language Models](https://crfm.stanford.edu/helm/)
- [MT-Bench: Multi-Turn Benchmark](https://github.com/lm-sys/FastChat/blob/main/fastchat/llm_judge/README.md)

### Production Considerations

**Difficulty**: Advanced  
**Time**: 10+ hours  
**Prerequisites**: Understanding of production systems, monitoring

**Topics:**

- **Cost**: Token usage, API costs, infrastructure
- **Latency**: Response time, caching strategies
- **Reliability**: Error handling, fallbacks, retries
- **Scalability**: Load balancing, rate limiting
- **Security**: Prompt injection, data privacy

**Resources:**

- [AI Engineering: Production Chapter](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)
- [LangChain Production Guide](https://js.langchain.com/docs/production/)

### Security and Safety

**Difficulty**: Advanced  
**Time**: 6-8 hours  
**Prerequisites**: Understanding of security principles

**Topics:**

- **Prompt injection**: Preventing malicious input
- **Data privacy**: Handling sensitive data
- **Output filtering**: Catching harmful content
- **Access control**: Who can use the system

**Resources:**

- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Anthropic Safety Guide](https://www.anthropic.com/safety)

### Multi-Model Strategies

**Difficulty**: Advanced  
**Time**: 8-10 hours  
**Prerequisites**: Understanding of multiple models, routing

**Topics:**

- **Model routing**: Choose model based on task
- **Ensemble methods**: Combine multiple models
- **Fallback chains**: Try models in sequence
- **Cost optimization**: Use cheaper models when possible

**Implementation:**

```typescript
async function generateWithFallback(context: string): Promise<string> {
  // Try expensive model first
  try {
    return await generateWithModel(context, "llama3.1:70b");
  } catch (error) {
    // Fallback to cheaper model
    return await generateWithModel(context, "llama3.1:8b");
  }
}
```

---

## Learning Path Recommendations

### Path 1: Deep Practitioner (2-3 months)

1. **Week 1-2**: Master Step 01, apply to your use case
2. **Week 3-4**: Implement error handling and observability
3. **Week 5-6**: Build Step 02 chain implementation
4. **Week 7-8**: Build Step 03 RAG implementation
5. **Week 9-10**: Production considerations and security
6. **Week 11-12**: Advanced topics (fine-tuning, multi-model)

### Path 2: Quick Starter (2-3 weeks)

1. **Week 1**: Master Step 01, apply to simple use case
2. **Week 2**: Add error handling, try different models
3. **Week 3**: Build one project (documentation or test cases)

### Path 3: Researcher (1-2 months)

1. **Week 1-2**: Master Step 01, understand evaluation
2. **Week 3-4**: Deep dive into evaluation metrics
3. **Week 5-6**: Benchmark different approaches
4. **Week 7-8**: Publish findings or contribute to repo

---

## Contributing

Found a bug? Have an improvement? Want to add a project idea?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Areas needing contribution:**

- Additional project ideas
- Code examples for engineering improvements
- Evaluation strategies
- Production patterns

---

## Getting Help

**Stuck?** Here's where to get help:

1. **Check documentation**: `docs/STEP_01_SINGLE_PROMPT_PLUS_EVAL.md`
2. **Search issues**: GitHub issues for similar problems
3. **Ask community**: LangChain Discord, Stack Overflow
4. **Open issue**: If you find a bug or need help

**Remember**: The Generate → Evaluate → Iterate pattern applies to learning too. Try something, evaluate what worked, iterate on your approach.
