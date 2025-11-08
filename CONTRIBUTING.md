# Contributing Guide

## Philosophy: User Control First

This project prioritizes **user control** and **transparent iteration** over speed or automation.

## Step-by-Step Collaboration Process

### 1. Problem Definition
- User states the specific problem or need
- AI asks clarifying questions if needed
- Agreement on the exact goal before proceeding

### 2. Proposal Phase
- AI proposes ONE specific change
- Explanation includes:
  - What will be changed
  - Why it's needed
  - What files will be affected
  - Expected outcome
- User approves, rejects, or requests modifications

### 3. Implementation Phase
- AI makes ONLY the approved change
- Changes are minimal and surgical
- No "extra" improvements without permission
- Code is committed with clear description

### 4. Verification Phase
- User reviews the change
- Testing/validation happens together
- Issues are addressed before moving forward

### 5. Iteration
- Return to step 2 for the next change
- Each iteration is independent and controlled

## Communication Guidelines

### DO:
✅ Ask permission before making changes
✅ Explain reasoning clearly
✅ Make small, focused changes
✅ Wait for confirmation
✅ Provide options when uncertain
✅ Admit when you don't know
✅ Respect user's preferred workflow

### DON'T:
❌ Make multiple changes at once without approval
❌ Assume what the user wants
❌ Rush through steps
❌ Add features not requested
❌ Make changes in "stealth"
❌ Override user preferences

## Example Good Interaction

```
User: "I need to add error handling to the RecursiveAgent class"

AI: "I can help with that. Let me propose a small first step:
     
     Step 1: Add try-catch to the makeDecision() method
     
     This would wrap the existing logic and catch any errors,
     logging them with the debugLog method that's already there.
     
     Would you like me to:
     a) Proceed with this change
     b) Show you the exact code first
     c) Start with a different method
     d) Take a different approach entirely"

User: "Show me the code first"

AI: [shows exact proposed changes]

User: "That looks good, proceed"

AI: [makes only that change, commits, reports]
```

## Example Bad Interaction (to avoid)

```
User: "I need to add error handling"

AI: [immediately makes changes to 5 different methods,
     adds new features, refactors code structure,
     adds dependencies, updates documentation,
     commits everything at once]
     
This violates the principle of user control.
```

## Working with AI Agents

### Setting Expectations
- Tell the AI your preferred pace
- Request step-by-step if that works better
- Ask for explanations when needed
- Pause the process if it's going too fast

### Maintaining Control
- Review each change before approval
- Ask "why" when something is unclear
- Request alternatives if proposed solution isn't right
- Take breaks between changes if helpful

### Effective Feedback
- Be specific about what's not working
- Explain your preferred approach
- Share examples of good interactions from past experience
- Update these guidelines with what works for you

## Customizing This Process

**This workflow is flexible.** If you prefer:
- Even smaller steps
- More/less explanation
- Different commit strategies
- Alternative tools or approaches

Just say so! The process adapts to you, not the other way around.
