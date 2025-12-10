## BACKGROUND

"""
{background}
"""

## TASK

Based on the context and decision drivers provided, identify viable options and analyse the pros and cons for each option.

Provide a list of 2 to 5 viable options with their pros and cons.

**IMPORTANT**: Each option MUST include at least one argument with "Good" impact and at least one argument with "Bad" impact. This ensures balanced analysis of each option.

## CONTEXT

"""
{context}
"""

## FORMAT

Return the result in JSON format.

### Example

```JSON
{{
    "options": [
        {{
            "title": "title of option",
            "description": "example | description | pointer to more information",
            "arguments": [
                {{
                    "impact": "Good|Bad|Neutral",
                    "argument": "argument"
                }},
                ...,
            ]
        }},
        ...,
    ]
}}
```
