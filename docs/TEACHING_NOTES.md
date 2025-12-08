# Teaching Notes: AI Fluency for Builders Masterclass

**Duration**: 2 hours (120 minutes)  
**Format**: Online, follow-along show and tell  
**Focus**: Interactive prompt engineering sections

---

## Pre-Session Preparation

### Materials to Have Ready

- Pre-generated ADR outputs for each level (fallback if live runs are slow)
- Troubleshooting script (see end of document)
- Screen sharing setup: Terminal, VS Code, browser
- Example context file: `src/step01/__fixtures__/example-context.md`
- Example ADR file: `src/step01/__fixtures__/example-adr.md`

### Setup Verification (Before Session Starts)

- Ollama running: `curl -f http://localhost:11434/api/version`
- Models pulled: `ollama list` shows `llama3.1:8b` and `nomic-embed-text`
- Repo cloned and dependencies installed
- `.env` configured with `OLLAMA_MODEL` and `OLLAMA_MODEL_EMBED`

---

## Session Structure

### Introduction & Setup Check (10 minutes)

#### Welcome & Learning Outcomes (3 min)

**What to say:**
"Welcome to AI Fluency for Builders. Today we'll build a working AI-powered tool using local LLMs. This is a confidence builder - you don't need to memorize everything. By the end, you'll understand that AI engineering is just software engineering: small loops, red-green-refactor, change one thing at a time."

**Show on screen:**

- Course learning outcomes slide
- Core message: "AI is an assistant, not a magic box"
- Key message: "AI engineering = software engineering"

**Key points:**

- You're experienced developers (comfortable with git, TypeScript/JavaScript)
- Most of you have used AI tools (Copilot, ChatGPT) - DORA research shows 90% of developers do
- But you haven't built AI-augmented tools yourself - that's what we'll do today
- This is a confidence builder, not a test - you don't need to memorize everything
- We'll use a straightforward example: documenting software decisions
- You'll learn the Generate → Evaluate → Iterate pattern that scales to any AI workflow
- **AI engineering is just software engineering**: small loops, red-green-refactor, change one thing at a time
- **Plenty of time for playing with prompts** - that's where the learning happens

#### Core Pattern: Generate → Evaluate → Iterate (4 min)

**What to say:**
"This pattern is the backbone of everything we'll do today. It works at every sophistication level. And it's just software engineering: red-green-refactor, small loops, change one thing at a time."

**Show on screen:**

- Workflow diagram slide (from `STEP_01_SINGLE_PROMPT.md`)
- Point out the loop: Generate → Evaluate → Iterate
- Parallel: Red → Green → Refactor (TDD)

**Key points:**

- **Generate**: AI creates output from your prompt (like writing a test)
- **Evaluate**: Another AI (or you) judges the quality (like running the test)
- **Iterate**: Use feedback to improve the prompt (like refactoring)
- This pattern scales from simple prompts to complex chains and RAG
- **Small loops**: Make one change, test, iterate
- **Change one thing at a time**: So you know what worked
- **No memorization needed**: Just practice the loop

**Transition:**
"Let's start with the simplest version: a single prompt."

#### Setup Verification (3 min)

**What to do:**

- Quick poll: "Who has Ollama running? Who has models pulled?"
- Show terminal: `curl -f http://localhost:11434/api/version`
- Show project structure: `tree src/step01` or file explorer
- Show branch strategy: `git branch` or explain branches for Step 01, 02, 03

**Screen sharing:**

- Terminal showing Ollama version
- VS Code showing project structure: `src/step01/`
- Highlight: `prompts/`, `adr/`, `eval/`, `shared/`

**Troubleshooting:**

- If Ollama not running: "Start with `ollama serve` or check system service"
- If models missing: "Run `ollama pull llama3.1:8b` and `ollama pull nomic-embed-text`"

---

### Level 1: Single Prompt (30 minutes)

#### Show & Tell: Generate ADR (10 min)

**What to do:**

1. Open terminal in `src/step01/`
2. Show example context: `cat __fixtures__/example-context.md`
3. Run generation: `yarn adr generate __fixtures__/example-context.md`
4. Show output: Open generated ADR in `docs/decisions/drafts/`

**Screen sharing:**

- Terminal showing command execution
- VS Code showing `src/step01/__fixtures__/example-context.md`
- VS Code showing generated ADR file

**What to say:**
"Let's break down what just happened:

1. We passed a problem statement to the LLM
2. The LLM generated structured JSON output
3. We validated it with Zod schemas
4. We converted it to Markdown format"

**Show on screen:**

- `src/step01/adr/schema.ts` - Zod schema definition
- `src/step01/generate-adr.ts` - Code showing `withStructuredOutput(adrSchema)`
- Generated ADR markdown file

**Key points:**

- **Structured output**: JSON + Zod catches errors before they propagate
- **Validation**: Ensures output matches expected format
- **Temperature 0**: Deterministic outputs (important for reproducibility)

**Prompt Engineering Guidance:**

- Show `src/step01/prompts/system-prompt.md` - Role definition
- Show `src/step01/prompts/adr-prompt.md` - Task definition
- Explain structure: Role → Task → Format → Examples
- Point out: System prompt sets context, human prompt provides task

**Transition:**
"Now we have an ADR. But is it any good? Let's evaluate it."

#### Evaluation Introduction (5 min)

**What to do:**

1. Run evaluation: `yarn adr evaluate docs/decisions/drafts/NNNN-*.md`
2. Show evaluation output: Open `.eval.md` file
3. Explain evaluation rubric

**Screen sharing:**

- Terminal showing evaluation command
- VS Code showing evaluation output file
- Highlight scores: clarity, justified, comprehensive, actionable

**What to say:**
"Evaluation is foundational, not optional. It's the mechanism that lets you trust AI outputs."

**Show on screen:**

- `src/step01/eval/schema.ts` - Evaluation schema
- `src/step01/prompts/eval-prompt.md` - Evaluation prompt with rubric

**Key points:**

- **LLM-as-judge pattern**: Use AI to critique AI
- **Four criteria**: Clear, Justified, Comprehensive, Actionable
- **Scores 1-5**: 1 = insufficient, 3 = adequate, 5 = excellent
- **Suggestions**: Actionable improvements

**Evaluation Depth:**

- Why separate judge model? Different perspective, reduces bias
- Limitations: Judge can miss domain-specific issues
- When to trust: High scores (4-5) with specific suggestions
- When to override: Low scores or suggestions that don't match your context

**Transition:**
"Now let's improve the prompt based on evaluation feedback."

#### Interactive Section 1: Prompt Engineering (15 min - expanded for experimentation)

**What to do:**

1. Show evaluation scores and suggestions
2. Identify one area to improve (e.g., clarity, tradeoffs)
3. Participants modify `src/step01/prompts/adr-prompt.md`
4. Regenerate and compare

**Screen sharing:**

- VS Code showing `src/step01/prompts/adr-prompt.md`
- Evaluation file with scores and suggestions
- Side-by-side: old prompt vs new prompt

**What to say:**
"Let's use the evaluation feedback to improve our prompt. Pick one area:

- Low clarity? Add more structure, be explicit about what 'clear' means
- Low tradeoffs? Explicitly ask for tradeoff analysis, add examples
- Low completeness? List required sections explicitly, add checklist format
- Low rationale? Ask for specific justification criteria"

**Discussion prompts:**

- "What did the evaluator catch that you might have missed?"
- "Which suggestion will you implement first?"
- "How does this change affect the output?"

**Prompt Engineering Guidance:**

- **Structure**: Role → Task → Format → Examples
- **Be explicit**: Don't assume the LLM knows what you mean
- **Use examples**: Show, don't just tell
- **Temperature**: 0 for deterministic, higher for creativity (not recommended here)
- **System vs Human**: System = role/context, Human = task/input

**Activity:**

1. Participants modify prompt (8 min - plenty of time for experimentation)
   - Encourage trying different approaches
   - Remind: "Change one thing at a time" (software engineering principle)
   - Remind: "This is red-green-refactor - make it work, then make it better"
2. Regenerate ADR (2 min)
3. Re-evaluate (2 min)
4. Share results in chat: "What changed? Did scores improve? What surprised you?" (3 min)
   - Focus on learning, not perfection
   - Celebrate small improvements
   - **Transferability prompt**: "This pattern isn't ADR-specific. How would you apply it to `docs/testing/support`? We'll discuss more in wrap-up."

**Common Pitfalls:**

- **Schema mismatches**: Prompt asks for X but schema expects Y
- **Vague instructions**: "Make it better" vs "Add 3 specific tradeoffs"
- **Too many changes at once**: Make one change, test, then iterate

**Transferability Note (integrated into share results):**
During the "Share results" discussion, add: "This pattern isn't ADR-specific. How would you apply Generate → Evaluate → Iterate to `documentation/test cases/support responses`? Just think about it - we'll discuss more in wrap-up."

**Transition:**
"Great! You've mastered the basic pattern. Now let's see how structured chains can improve consistency."

---

### Level 2: Sequential Chain (35 minutes)

#### Chain Introduction (10 min)

**What to do:**

1. Switch to Step 02 branch: `git checkout step-02-sequential-chain` (if exists)
2. Show chain structure: `src/step02/generate-adr-chain.ts` (if exists)
3. Walk through chain stages
4. Run chain generation
5. Compare output vs one-shot

**Screen sharing:**

- VS Code showing chain code structure
- Terminal showing chain execution
- Side-by-side: one-shot ADR vs chain ADR

**What to say:**
"Chains break complex tasks into stages. Each stage has its own prompt and validation."

**Show on screen:**

- Chain stages: context → options → tradeoffs → decision → final
- Intermediate validation at each stage
- Error handling between stages

**Key points:**

- **Multi-step reasoning**: Break complex tasks into simpler steps (like writing code: function by function)
- **Intermediate validation**: Check each step works before moving on (like unit tests)
- **Consistency**: Each stage builds on previous output (like a pipeline)
- **Trade-off**: More complexity, but often better quality

**Advanced Patterns Preview:**

- **Conditional chains**: Different paths based on output
- **Parallel chains**: Run multiple chains simultaneously
- **Feedback loops**: Use evaluation to guide next stage
- **Retry logic**: Handle failures gracefully

**Transition:**
"Now let's evaluate the chain output using the same evaluation we used for Step 01."

#### Evaluation: Same Schema, Better Output? (5 min)

**What to do:**

1. Run evaluation using Step 01 evaluator: `yarn tsx evaluate-adr.ts docs/decisions/drafts/NNNN-*.md`
2. Show evaluation output with same 4 criteria (clarity, justified, comprehensive, actionable)
3. Compare chain output scores vs one-shot scores

**Screen sharing:**

- Terminal showing evaluation command (same as Step 01)
- Evaluation output file (same format as Step 01)
- Side-by-side: one-shot scores vs chain scores

**What to say:**
"We're using the same evaluation schema as Step 01. The question is: does the chain approach produce better scores?"

**Key points:**

- **Same evaluation criteria**: Clarity, Justified, Comprehensive, Actionable
- **Compare approaches**: Does chain improve scores?
- **Consistent measurement**: Same eval = fair comparison
- **Homework**: Per-step evaluation (evaluating each chain stage separately) is advanced - try it after the masterclass

**Evaluation Focus:**

- Did chain output score higher than one-shot?
- Which criteria improved most?
- What still needs work?

**Transition:**
"Now let's refine the chain to improve these scores."

#### Interactive Section 2: Chain Refinement (20 min - expanded for experimentation)

**What to do:**

1. Show evaluation scores (same 4 criteria from Step 01)
2. Identify which criteria need improvement
3. Participants modify prompts for specific chain stages
4. Re-run chain and evaluate
5. Compare before/after scores

**Screen sharing:**

- VS Code showing chain prompt files
- Evaluation output with Step 01 criteria
- Before/after comparison

**What to say:**
"Use the same evaluation feedback approach as Step 01. If clarity is low, improve the final stage prompt. If tradeoffs are weak, improve the tradeoff stage prompt."

**Discussion prompts:**

- "Did chain scores improve over one-shot?"
- "Which criteria improved most with chains?"
- "How does improving one stage affect overall scores?"

**Common Pitfalls:**

- **Schema mismatches**: Each stage must match its schema
- **Prompt injection**: Malicious input can break chain flow
- **Error propagation**: One stage failure breaks entire chain
- **Over-engineering**: Sometimes simpler is better

**Activity:**

1. Review evaluation scores (2 min)
2. Identify which criteria to improve (2 min)
3. Modify relevant stage prompt (10 min - plenty of time for experimentation)
   - Encourage trying different approaches
   - Remind: "Small loops, change one thing at a time"
   - Remind: "This is just software engineering - iterate until it works"
4. Re-run chain and evaluate (3 min)
5. Compare scores: "Did we beat the one-shot score? What did you learn?" (3 min)
   - Focus on learning, not perfection
   - Celebrate improvements, learn from failures

**Homework Note:**
"Advanced: Try evaluating each chain stage separately. This helps identify which stage needs improvement. See `docs/WHAT_NEXT.md` for guidance."

**Transition:**
"Excellent! Now let's add real-world context with RAG."

---

### Level 3: Retrieval-Augmented Generation (35 minutes)

#### RAG Introduction (10 min)

**What to do:**

1. Switch to Step 03 branch: `git checkout step-03-retrieval-augmented-generation` (if exists)
2. Show RAG pipeline: load PDFs → embed → vector store → retrieve → augment
3. Generate ADR with retrieved context
4. Show retrieved documents

**Screen sharing:**

- VS Code showing RAG code structure
- Terminal showing RAG execution
- Browser/PDF viewer showing source documents
- Generated ADR with citations

**What to say:**
"RAG adds real-world context. Instead of relying on the model's training data, we retrieve relevant documents."

**Show on screen:**

- RAG pipeline diagram
- Vector store structure
- Retrieval process: query → embeddings → similarity search → top-k documents

**Key points:**

- **Embeddings**: Convert text to numbers (vectors) so we can find similar documents
- **Vector store**: Like a search index, but for semantic similarity
- **Retrieval**: Find documents that match your question (like Google search, but for meaning)
- **Augmentation**: Add those documents to your prompt so the LLM has real context

**Evaluation Depth:**

- **Context-aware evaluator**: Checks "does ADR actually use retrieved info?"
- **Grounding**: Are claims supported by retrieved documents?
- **Citation quality**: Are sources cited correctly?

**Transition:**
"Now let's evaluate the RAG output using the same evaluation from Step 01."

#### Evaluation: Can RAG Improve Step 01 Scores? (5 min)

**What to do:**

1. Run evaluation using Step 01 evaluator: `yarn tsx evaluate-adr.ts docs/decisions/drafts/NNNN-*.md`
2. Show evaluation output with same 4 criteria (clarity, justified, comprehensive, actionable)
3. Compare RAG output scores vs one-shot and chain scores

**Screen sharing:**

- Terminal showing evaluation command (same as Step 01)
- Evaluation output file (same format as Step 01)
- Side-by-side: one-shot scores vs chain scores vs RAG scores

**What to say:**
"We're using the same evaluation schema again. The question is: does RAG with real context improve the scores?"

**Key points:**

- **Same evaluation criteria**: Clarity, Justified, Comprehensive, Actionable
- **Compare all approaches**: One-shot vs Chain vs RAG
- **Focus on improvement**: Can RAG beat previous scores?
- **Homework**: Evaluation of retrieval quality (checking if retrieved documents are relevant) is advanced - try it after the masterclass

**Evaluation Focus:**

- Did RAG output score higher than one-shot or chain?
- Which criteria improved most with real context?
- What still needs work?

**Show example "bad RAG ADR":**

- Generic advice instead of context-specific (low comprehensive score)
- Missing important constraints from documents (low actionable score)
- Claims not clearly supported (low justified score)

**Transition:**
"Let's refine the RAG approach to improve these scores."

#### Interactive Section 3: RAG Refinement (20 min - expanded for experimentation)

**What to do:**

1. Show evaluation scores (same 4 criteria from Step 01)
2. Identify which criteria need improvement
3. Participants adjust retrieval parameters or prompt augmentation
4. Re-generate and evaluate
5. Compare before/after scores

**Screen sharing:**

- VS Code showing RAG configuration
- Evaluation output with Step 01 criteria
- Retrieved documents (for reference, not evaluation)

**What to say:**
"Use the same evaluation feedback approach. If comprehensive score is low, maybe we need better retrieval. If actionable score is low, maybe we need to augment the prompt differently."

**Discussion prompts:**

- "Did RAG scores improve over one-shot or chain?"
- "Which criteria improved most with real context?"
- "How does retrieval quality affect evaluation scores?"

**Reflection Exercises:**

- "What did the evaluator catch that you missed?"
- "What's still wrong that neither generator nor evaluator caught?"
- "How would you iterate on this?"

**Activity:**

1. Review evaluation scores (2 min)
2. Identify which criteria to improve (2 min)
3. Adjust retrieval or prompt augmentation (10 min - plenty of time for experimentation)
   - Encourage trying different approaches
   - Remind: "Small loops, change one thing at a time"
   - Remind: "This is just software engineering - iterate until it works"
4. Re-generate ADR (3 min)
5. Compare scores: "Did we beat previous scores? What did you learn?" (3 min)
   - Focus on learning, not perfection
   - Celebrate improvements, learn from failures

**Common Pitfalls:**

- **Retrieval quality**: Wrong documents retrieved (affects comprehensive score)
- **Prompt augmentation**: Retrieved context not used effectively (affects actionable score)
- **Hallucinations**: Model makes claims without evidence (affects justified score)
- **Missing context**: Important documents not retrieved (affects all scores)

**Homework Note:**
"Advanced: Try evaluating retrieval quality separately. Check if retrieved documents are relevant and if they're actually used in the ADR. See `docs/WHAT_NEXT.md` for guidance."

**Transition:**
"Excellent work! Let's reflect on what we've learned."

---

### Wrap-up & Reflection (10 minutes)

#### Key Takeaways & Reflection (7 min)

**What to say:**
"Let's recap the core pattern and how it scales. Remember: this is a confidence builder, not a test. You don't need to memorize everything."

**Key points:**

1. **Generate → Evaluate → Iterate** pattern scales to all levels
2. **Evaluation is foundational**, not optional - it's how you trust AI outputs
3. **AI engineering is just software engineering**:
   - Small loops (red-green-refactor)
   - Change one thing at a time
   - Iterate until it works
   - No memorization needed - just practice
4. **Common patterns** that generalize beyond ADRs:
   - Structured output (JSON + Zod)
   - LLM-as-judge evaluation
   - Iterative prompt improvement
   - Context augmentation (RAG)

**Show on screen:**

- Pattern comparison: Step 01 vs Step 02 vs Step 03
- Common elements across all levels
- Transferability examples

**Transferability:**

- **Documentation**: Generate docs, evaluate clarity, iterate
- **Testing**: Generate test cases, evaluate coverage, iterate
- **Support**: Generate responses, evaluate helpfulness, iterate
- **Code review**: Generate suggestions, evaluate relevance, iterate

**Reflection exercises:**

1. "What surprised you about AI's capabilities?"
2. "What surprised you about AI's limitations?"
3. "What would you try next in your own context?"
4. "How does this pattern apply to your work?"
5. "What did you learn about AI engineering being just software engineering?"
6. "What's one thing you'll try this week?" (confidence builder - small steps)

**Transition:**
"Any questions? Remember: this is just the beginning. Keep practicing the loop."

#### Q&A (3 min)

**Discussion prompts:**

- "Which level was most useful for your context?"
- "What evaluation criteria matter most for your use case?"
- "How would you adapt this pattern to `docs/testing/support`?"

**Accessibility:**

- **Keyboard shortcuts**: Mention VS Code shortcuts for navigation
- **Screen reader**: Ensure code examples are readable
- **Alternative formats**: Offer transcript, slides, or video recording

**What Next preview:**

- Point to `docs/WHAT_NEXT.md` for detailed learning paths
- Mention: Error handling, LangChain patterns, observability
- Suggest: Apply pattern to your own use case this week

**Invitation:**
"Extend the repo! Try Steps 02 and 03 hands-on. Share your improvements. This is just the beginning."

**Q&A:**

- Answer questions about implementation details
- Discuss specific use cases
- Provide troubleshooting help

---

## Troubleshooting Script

### Common Issues During Session

#### Ollama Connection Errors

**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:11434`

**Fix:**

1. Check Ollama is running: `curl -f http://localhost:11434/api/version`
2. If not running: `ollama serve` (foreground) or `systemctl --user start ollama` (Linux)
3. Check firewall settings

**What to say:**
"Ollama needs to be running. Let's check the daemon status."

#### Model Not Found

**Symptom**: `Error: model 'llama3.1:8b' not found`

**Fix:**

1. Check models: `ollama list`
2. Pull model: `ollama pull llama3.1:8b`
3. Verify in `.env`: `OLLAMA_MODEL=llama3.1:8b`

**What to say:**
"The model needs to be downloaded first. This is a one-time setup."

#### Validation Errors

**Symptom**: `ZodError: Invalid input`

**Fix:**

1. Check prompt template matches schema
2. Look for typos in field names
3. Verify required fields are present
4. Check JSON format in prompt example

**What to say:**
"Validation errors mean the LLM output didn't match our schema. Let's check the prompt template."

#### Slow Generation

**Symptom**: Generation takes >30 seconds

**Fix:**

1. Use pre-generated outputs (have ready)
2. Check model size (smaller = faster)
3. Verify GPU/CPU resources
4. Consider using a smaller model for demo

**What to say:**
"LLM generation can be slow. Let's use a pre-generated example while we wait."

#### Evaluation Fails

**Symptom**: Evaluation doesn't run or returns errors

**Fix:**

1. Check ADR file path is correct
2. Verify ADR file exists
3. Check evaluation schema matches prompt
4. Verify judge model is available

**What to say:**
"Evaluation needs a valid ADR file. Let's check the file path."

### Pre-Session Troubleshooting

**Before session starts:**

- Test all commands
- Verify models are pulled
- Pre-generate example outputs
- Test screen sharing setup
- Have backup plan for slow connections

---

## Time Management

### Buffer Time

- 5 minutes buffer for technical issues
- 2 minutes per interactive section for questions
- 1 minute per transition for setup

### If Running Behind

- Skip detailed code walkthroughs
- Use pre-generated outputs
- Reduce interactive time
- Focus on core pattern, not implementation details

### If Running Ahead

- Deep dive into evaluation criteria
- Discuss more use cases
- Show advanced patterns
- Extended Q&A

---

## Notes for Delivery

### Screen Sharing Best Practices

- Use large font sizes (18pt+)
- Highlight active areas with cursor
- Pause for participants to catch up
- Repeat important commands
- Show file paths clearly

### Interactive Sections

- Give clear time limits
- Provide example modifications
- Encourage sharing in chat
- Acknowledge good questions
- Keep momentum moving

### Accessibility

- Describe what you're showing on screen
- Read code examples aloud
- Provide alternative formats
- Check chat for questions
- Offer breaks if needed

---

## Post-Session

### Follow-up Materials

- Share slides and recording (if available)
- Point to `docs/WHAT_NEXT.md`
- Provide repo link
- Offer office hours for questions

### Feedback Collection

- What worked well?
- What was confusing?
- What would you change?
- What will you try next?
