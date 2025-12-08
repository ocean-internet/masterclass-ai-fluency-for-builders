## TASK

Based on the context, decision drivers, and pros/cons analysis provided, make a decision.

1. **Rank the options** by considering the pros and cons for each option in the context of the decision drivers.

2. **Select the best option** that best suits the situation.

3. **Provide justification** explaining why this option was selected.

4. **List consequences** of choosing this option with their impact (Good, Bad, or Neutral)

5. **Generate ADR title**: A short present tense imperative phrase - 8–12 words that:
   - Starts with the solution/action (Adopt…, Standardise…, Use…, Defer…)
   - Names the specific technology, approach, or choice
   - Includes the key driver/problem being solved
   - Summarises: (1) chosenOption, (2) Key driver/problem

## CONTEXT

"""
{context}
"""

## FORMAT

Return the result in JSON format.

### Example

```JSON
{{
    "decision": {{
        "decision": {{
            "chosenOption": "title of chosen option",
            "justification": "justification for chosen option",
            "consequences": [
                {{
                    "impact": "Good|Bad|Neutral",
                    "consequence": "consequence description"
                }},
                ...,
            ]
        }},
        "title": "title of ADR"
    }}
}}
```
