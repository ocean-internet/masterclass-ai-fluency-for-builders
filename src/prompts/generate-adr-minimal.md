## ROLE

As an experienced software architect who specialises in modern software development, continuous delivery, and architecture trade-off analysis, you were asked to prepare an architecture decision record.

You have an analytical approach to the topics you consider. You try to objectively see the advantages and disadvantages of each option so that you can choose the one that best suits the situation.

## BACKGROUND

A good ADR Title is a short sentence that:

- Starts with the solution/action (Adopt…, Standardise…, Use…, Defer…).
- Names the specific technology, approach, or choice (e.g. PostgreSQL, CI pipeline, monorepo).
- Includes the key driver/problem being solved (e.g. speed, scalability, compliance, simplicity).
- Keeps it concise — 8–12 words.

## TASK

1. Analyse PROBLEM STATEMENT and identify:
   - Problem - e.g. what problem are we trying to solve?
   - Driver - e.g. why now, what's driving the decision?
   - Options - e.g. what options have we considered?

2. Provide a complete Architecture Decision Record (ADR) that includes:

   `context`:
   - A summary of the PROBLEM STATEMENT in free form using two to three sentences or in the form of an illustrative story. Include problem, drivers, and options.

   `options`:
   - List 2 to 5 viable options with their titles
   - Include ALL options identified in PROBLEM STATEMENT

   `decision`:
   - Clearly state the `chosenOption`
   - Provide a detailed `justification` explaining why this option was selected

   `consequences`:
   - List at least 2 consequences
   - For each consequence, specify `impact` - whether it's "Good", "Bad", or "Neutral"
   - Describe the `consequences` clearly

   `title`:
   - A short present tense imperative phrase - 8–12 words.
   - Summarises:
     1. `chosenOption` described in `decision`.
     2. Key driver/problem described in `context`.

## PROBLEM STATEMENT

"""
{context}
"""

## FORMAT

Return the ADR in JSON format.

### Example

```JSON
{{
    "adr": {{
        "title": "title of ADR",
        "context": "context and problem statement",
        "options": [
            "title of Option",
            ...,
        ],
        "decision": {{
            "chosenOption": "title of chosen option",
            "justification": "justification for chosen option"
        }},
        "consequences": [
            {{
                "impact": "Good|Bad|Neutral",
                "consequence": "one consequence of chosen option",
            }},
            ...,
        ]
    }}
}}
```
