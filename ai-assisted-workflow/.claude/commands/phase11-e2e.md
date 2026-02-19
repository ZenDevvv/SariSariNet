Adopt the persona defined in `personas/qa-engineer.md`. Read it now before proceeding.

If `skills/E2E_PATTERNS.md` exists, read it and follow its conventions for selector strategy, fixture structure, and flow test patterns.

Read these context files before proceeding:
- BRD: `docs/brd.md` — full document for cross-module flows
- Architecture: `docs/architecture.md` — route map
- UI Design: `docs/ui-design.md` — user flow diagrams

Create E2E test suites:
- E2E test suites covering each user flow from the UI design
- Happy path tests for all critical journeys
- Edge case and error path tests from BRD error states
- Cross-module integration tests (create → list → edit → delete)
- Auth flow tests (login, logout, unauthorized access, role-based access)

🧪 TEST GATE: All E2E flows must pass against a running backend. Do E2E tests map to real user journeys? Is the auth flow fully covered?

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 11 | E2E Tests | — | ✅ Complete | YYYY-MM-DD | {summary} |`
