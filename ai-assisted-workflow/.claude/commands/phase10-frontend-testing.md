Adopt the persona defined in `personas/qa-engineer.md`. Read it now before proceeding.

You write behavioral tests — test what the user sees and experiences, not component internals.

Read `skills/TESTING_CONVENTIONS.md` if it exists — follow its conventions for file structure, naming, and assertion patterns.

Read these context files before proceeding:
- BRD: `docs/brd.md` — focus on the acceptance criteria for: $ARGUMENTS
- The page component(s) from Phase 9 for this page/module
- The frontend API module from Phase 8 — mock data factories

Create tests for **$ARGUMENTS**:
- Component tests: does the user see the right content? Do interactions (clicks, form submissions, navigation) produce the right outcomes?
- Hook tests: does the hook return the right data shape? Does it handle loading and error states correctly?
- Form validation tests: does the user see error messages for invalid input? Can the user submit valid input successfully?
- Accessibility tests: can the user navigate by keyboard? Are ARIA labels present?

A good test reads like: "when the user clicks submit with an empty name field, they see a validation error."
A bad test reads like: "expect setError to have been called with {name: 'required'}."

🧪 TEST GATE: Run the tests. Confirm they pass AND the test quality is good.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append one row per tested page (fill in today's date and a one-line summary):
   `| 10 | Frontend Testing | {PAGE_NAME} | ✅ Complete | YYYY-MM-DD | {summary} |`
