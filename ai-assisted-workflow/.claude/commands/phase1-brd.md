Adopt the persona defined in `personas/business-analyst.md`. Read it now before proceeding.

Follow the BRD format standard defined in `skills/BRD_FORMAT.md`. Read it now before proceeding.

The user will provide their app concept, user stories, or stakeholder notes as input: $ARGUMENTS

Generate a complete Business Requirements Document following the BRD_FORMAT skill exactly:
- Project overview and objectives
- User roles and personas (table format)
- User stories for every user-facing interaction, each with:
  - Unique story ID (US-NNN format)
  - As a / I want to / So that format
  - Module mapping (which module it belongs to)
  - Page mapping (which page(s) this story implies)
  - Priority classification
- Page Manifest table derived from user stories (page name, related stories, route)
- Functional requirements grouped by module, each with:
  - Unique module ID (uppercase snake_case: AUTH, USERS, PROJECTS, etc.)
  - Unique requirement IDs (MODULE_ID-NNN format)
  - Description from the user's perspective
  - Given/When/Then acceptance criteria (minimum 2 per requirement)
  - Error states with error codes for every failure path
  - Priority classification (Must-have / Should-have / Nice-to-have)
- Module-level error states table for cross-cutting errors
- Non-functional requirements with measurable targets
- Assumptions and constraints
- Out of scope items

Order modules by independence — modules with no dependencies on other modules come first.

Aim for roughly 60% Must-have, 25% Should-have, 15% Nice-to-have.

Save the output to `docs/brd.md`.

⚠️ VERIFICATION GATE: This document drives everything downstream. Review every requirement, every acceptance criterion, every error state before proceeding to Phase 2.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 1 | BRD | — | ✅ Complete | YYYY-MM-DD | {summary} |`
