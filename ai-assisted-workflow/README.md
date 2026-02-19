# AI-Assisted Fullstack Development Workflow

A 15-phase AI-assisted development workflow powered by Claude Code slash commands. Each phase automatically loads the right persona, skill documents, and context — no manual copy-pasting.

---

## How It Works

Every phase is a slash command. Type `/phase4b-backend-modules AUTH` and Claude Code automatically:

1. Adopts the Backend Engineer persona
2. Reads the MODULE_TEMPLATE.md skill doc
3. Reads your BRD and architecture doc for the AUTH module
4. Generates the module code

You review the output, make corrections, and move to the next phase.

## Sample Usage

```
/phase1-brd <your app concept or user stories>
/phase2-planning
/phase3-architecture
/phase4a-db-schema all
/phase4b-backend-modules <MODULE_NAME> | all
/phase5-backend-testing <MODULE_NAME> | all
/phase6-migrations
/phase7-ui-design <optional: screenshot paths and/or design rules>
/phase8-frontend-api <MODULE_NAME>
/phase9-pages <PAGE_NAME>
/phase10-frontend-testing <MODULE_OR_PAGE_NAME>
/phase11-e2e
/phase12-review <optional: what to review>
/phase13-docs
/phase14-deployment

# Start any new session — re-orients Claude with project state, stale items, and next action:
/resume

# Mid-project requirement changes:
/phase-change add bulk CSV export to REPORTS — finance team needs it for audits
```

---

## Repository Structure

```
├── CLAUDE.md                       # Auto-loaded by Claude Code — project context
├── .claude/commands/               # Slash commands
│   ├── phase1-brd.md               # BRD generation
│   ├── phase2-planning.md
│   ├── phase3-architecture.md
│   ├── phase4a-db-schema.md        # Prisma models + prisma generate
│   ├── phase4b-backend-modules.md  # Zod schemas, routes, controllers
│   ├── phase5-backend-testing.md
│   ├── phase6-migrations.md
│   ├── phase7-ui-design.md
│   ├── phase8-frontend-api.md
│   ├── phase9-pages.md
│   ├── phase10-frontend-testing.md
│   ├── phase11-e2e.md
│   ├── phase12-review.md
│   ├── phase13-docs.md
│   ├── phase14-deployment.md
│   └── resume.md                   # Session resume — project state, stale items, next action
│   └── phase-change.md             # Log requirement changes & get impact reports
│
├── personas/                       # AI persona files (9 roles)
│   ├── business-analyst.md
│   ├── project-manager.md
│   ├── software-architect.md
│   ├── backend-engineer.md
│   ├── qa-engineer.md
│   ├── ui-designer.md
│   ├── frontend-engineer.md
│   ├── technical-writer.md
│   └── devops-engineer.md
│
├── skills/                         # Reusable skill documents
│   ├── BRD_FORMAT.md               # BRD structure, module IDs, GWT criteria
│   ├── MODULE_TEMPLATE.md          # Backend file structure, Zod, controller patterns
│   ├── API_STANDARD.md             # Frontend hooks, service layer, Zod copy rules
│   ├── STYLE_GUIDE.md              # (created per-project in Phase 7)
│   └── ...                         # More skills added as you refine conventions
│
├── docs/                           # Project artifacts (created as you go)
│   ├── brd.md                      # Phase 1 output
│   ├── project-plan.md             # Phase 2 output
│   ├── architecture.md             # Phase 3 output
│   ├── ui-design.md                # Phase 7 output (wireframes + style guide combined)
│   ├── progress.md                 # Progress log (auto-updated after each phase)
│   └── changes.md                  # Change audit trail (created by /phase-change)
│
└── AI-Assisted Fullstack Development Workflow.md  # Full playbook reference
```

---

## Prerequisites

- **VSCode** with [Claude Code](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)
- A project idea to build

---

## Getting Started

1. **Clone this repo** into your workspace
2. **Open in VSCode** with Claude Code installed
3. **Run Phase 1**: type `/phase1-brd` followed by your app concept
4. **Review the BRD** carefully — it drives everything downstream
5. **Continue through phases** in order, using the slash commands

---

## Progress Tracking & Changes

Every phase automatically logs its completion to `docs/progress.md`:

```
| Phase | Name            | Scope       | Status      | Date       | Notes                            |
|-------|-----------------|-------------|-------------|------------|----------------------------------|
| 1     | BRD             | —           | ✅ Complete | 2026-02-18 | 5 modules, 32 requirements       |
| 2     | Planning        | —           | ✅ Complete | 2026-02-18 | 3 sprints, 4 risks flagged       |
| 4a    | DB Schema       | all         | ✅ Complete | 2026-02-19 | 6 models, prisma generate OK     |
| 4b    | Backend Module  | AUTH        | ✅ Complete | 2026-02-19 | Login, register, JWT             |
| 4b    | Backend Module  | USERS       | ✅ Complete | 2026-02-19 | CRUD + avatar upload             |
| 5     | Backend Testing | AUTH        | ⚠️ Stale   | 2026-02-19 | Tests OK | Stale: phase 4b AUTH re-run 2026-02-20 |
```

**Status values:**
- `✅ Complete` — phase finished and not invalidated by subsequent changes
- `⚠️ Stale` — phase was completed but a dependency was re-run or a change was logged that requires re-running this phase
- `🔄 Changed` — written by `/phase-change` to record a requirement change

Run `/resume` at the start of any session to see a summary of complete, stale, and pending phases — and the exact next command to run.

### Handling Mid-Project Changes

When requirements change or new features are added, use `/phase-change`:

```
/phase-change add bulk CSV export to REPORTS — finance team needs it for audits
```

This command:
1. **Updates the BRD** — adds or modifies requirements, never renumbers IDs
2. **Updates architecture** — if models or routes are affected
3. **Writes to `docs/changes.md`** — a timestamped change entry with:
   - What changed
   - Why (business context)
   - Which requirements/modules were affected
   - Exact phases that need re-running
4. **Logs to progress.md** — a `🔄 Changed` row
5. **Outputs an impact report** — so you know exactly what to action next

The `docs/changes.md` file is your audit trail — it answers "why does this exist?" months later.

---

## The 15 Phases

### Phase 1 — Business Requirements

```
/phase1-brd <your app concept or user stories>
```

Persona: Business Analyst | Skill: `BRD_FORMAT` | Output: `docs/brd.md`

Generates a complete BRD with module IDs, requirement IDs, Given/When/Then acceptance criteria, error states, **user stories**, and a **Page Manifest**. User stories map every user-facing interaction to a page — this becomes the source of truth for what Phase 7 designs and Phase 9 builds.

**Gate:** ⚠️ VERIFY — this document drives everything. Invest the most review time here.

---

### Phase 2 — Project Planning & Estimation

```
/phase2-planning
```

Persona: Project Manager | Skill: — | Reads: `docs/brd.md` | Output: `docs/project-plan.md`

Generates module breakdown, task estimates, sprint plan, dependency map, and risk register.

**Gate:** Review estimates and build order.

---

### Phase 3 — Architecture & Model Design

```
/phase3-architecture
```

Persona: Software Architect | Skill: `ARCHITECTURE_STANDARD` | Reads: `docs/brd.md`, `docs/project-plan.md` | Output: `docs/architecture.md`

Designs data models, ERD, API route map, auth strategy, and error standards. If `skills/ARCHITECTURE_STANDARD.md` doesn't exist yet, this phase creates it.

**Gate:** Review model relationships, API surface completeness, auth guards.

---

### Phase 4a — DB Schema

```
/phase4a-db-schema all | <MODEL_NAME>
```

**Example:** `/phase4a-db-schema all` or `/phase4a-db-schema User`

Persona: Backend Engineer | Skill: `MODULE_TEMPLATE` (Step 1) | Reads: `docs/architecture.md` (data models + ERD) | Output: `prisma/schema/[entity].prisma` files

Generates all Prisma schema files from the architecture doc's data models, defines all relations, and runs `npx prisma generate`. Run with `all` to process every model in dependency order.

**Gate:** All FK references resolve, relations are consistent on both sides, `prisma generate` succeeds.

---

### Phase 4b — Backend Module Generation

```
/phase4b-backend-modules <MODULE_NAME> | all
```

**Example:** `/phase4b-backend-modules AUTH` or `/phase4b-backend-modules all`

Persona: Backend Engineer | Skill: `MODULE_TEMPLATE` | Reads: `docs/brd.md` (module section), `docs/architecture.md` | Output: module code

Requires Phase 4a to be complete. Generates Zod schemas, routes, controllers, and middleware — using the already-generated Prisma client. Pass a module name for one module, or `all` to generate every module in dependency order.

**Gate:** ⚠️ VERIFY — Zod schemas become the frontend's source of truth. After the **first** module, run `/phase12-review` before generating more.

---

### Phase 5 — Backend Testing

```
/phase5-backend-testing <MODULE_NAME> | all
```

**Example:** `/phase5-backend-testing AUTH` or `/phase5-backend-testing all`

Persona: QA Engineer | Skill: `TESTING_CONVENTIONS` | Reads: `docs/brd.md` (acceptance criteria), Phase 4b module code, `docs/architecture.md`

Generates behavioral unit tests, integration tests, and Zod validation tests. Pass a module name for one module, or `all` to test every module. If `skills/TESTING_CONVENTIONS.md` doesn't exist yet, this phase creates it.

**Gate:** Run tests. Confirm they pass AND the test quality is good.

---

### Phase 6 — Database Migrations & Seed Data

```
/phase6-migrations
```

Persona: Backend Engineer | Skill: `MIGRATION_TEMPLATE` | Reads: `docs/brd.md`, `docs/architecture.md`, Phase 4a schemas, Phase 4b modules

Auto-detects database type. **SQL:** generates migration scripts, rollback scripts, and seed data. **MongoDB:** skips migrations (Prisma handles schema), generates Prisma seed scripts for all models with per-environment data (dev/staging/test). Does not generate index verification scripts — `prisma db push` handles indexes.

**Gate:** SQL: migrations run up and down cleanly. MongoDB: seed data passes Zod validation, FK relationships are consistent.

---

### Phase 7 — UI/UX Design & Style Guide

```
/phase7-ui-design <optional: screenshot paths and/or design rules>
```

**Examples:**
- `/phase7-ui-design` — generate designs using defaults
- `/phase7-ui-design docs/screenshots/reference.png mobile first, dark mode default`
- `/phase7-ui-design minimal sidebar, dark mode default`

Persona: UI Designer | Reads: `docs/brd.md` (Page Manifest from user stories), `docs/architecture.md` | Output: `docs/ui-design.md`

Generates everything in a single file: the Style Guide (exact Tailwind classes, shadcn variants, hex colors), wireframes, user flows, component inventory, responsive behavior, and state designs. If reference screenshots are provided, extracts colors, typography, spacing, and component patterns from them — visual style only, never features. Custom design rules (e.g., "mobile first", "dark mode default") are applied as hard constraints.

**Gate:** Does every page in the Page Manifest have a wireframe? Is every style guide rule specific enough to produce identical results across independently prompted pages?

---

### Phase 8 — Frontend API Modules

```
/phase8-frontend-api <MODULE_NAME>
```

**Example:** `/phase8-frontend-api AUTH`

Persona: Frontend Engineer | Skill: `API_STANDARD` | Reads: `docs/brd.md` (module section), Phase 4b Zod schemas, `docs/architecture.md`

Copies Zod schemas from backend, generates TypeScript types, endpoint configs, service layer, React Query hooks, and mock data factories for one module.

**Gate:** Do copied Zod schemas exactly match the backend?

---

### Phase 9 — Page Generation

```
/phase9-pages <PAGE_NAME>
```

**Example:** `/phase9-pages DashboardPage` or `/phase9-pages LoginPage`

Persona: Frontend Engineer | Reads: `docs/brd.md` (module section), `docs/ui-design.md` (wireframe + style guide), Phase 8 hooks/types

Builds one page at a time using Tailwind + shadcn/ui, following the style guide exactly. Implements all states: loading, empty, error, populated.

**Gate:** Does the page match the design? After the **first** page, run `/phase12-review` before generating more.

---

### Phase 10 — Frontend Testing

```
/phase10-frontend-testing <MODULE_OR_PAGE_NAME>
```

**Example:** `/phase10-frontend-testing DashboardPage`

Persona: QA Engineer | Skill: `TESTING_CONVENTIONS` | Reads: `docs/brd.md` (acceptance criteria), Phase 9 page, Phase 8 mock data

Generates behavioral component tests, hook tests, form validation tests, and accessibility tests.

**Gate:** Run tests. Confirm they pass AND the test quality is good.

---

### Phase 11 — Integration & E2E Testing

```
/phase11-e2e
```

Persona: QA Engineer | Skill: `E2E_PATTERNS` | Reads: `docs/brd.md`, `docs/architecture.md`, `docs/ui-design.md`

Generates E2E test suites covering user flows, happy paths, error paths, cross-module integration, and auth flows.

**Gate:** All E2E flows pass against a running backend.

---

### Phase 12 — Code Review (Rolling)

```
/phase12-review <optional: what to review>
```

**Examples:**

- `/phase12-review first backend module AUTH`
- `/phase12-review full backend track`
- `/phase12-review first frontend page DashboardPage`
- `/phase12-review` (auto-detects checkpoint based on progress)

Persona: Software Architect | Skill: `REVIEW_CHECKLIST` | Reads: `docs/brd.md`, `docs/architecture.md`, relevant code

Reviews code for security, performance, consistency, missing pieces, and API contract alignment. Run this at checkpoints — not just at the end.

**Gate:** All critical issues resolved before proceeding.

---

### Phase 13 — Documentation

```
/phase13-docs
```

Persona: Technical Writer | Skill: `DOC_TEMPLATES` | Reads: `docs/brd.md`, `docs/architecture.md`, Phase 4b Zod schemas

Generates README, API docs, environment variable docs, onboarding guide, and architecture decision records.

**Gate:** Does the README setup actually work? Do API doc examples match reality?

---

### Phase 14 — Deployment Configuration

```
/phase14-deployment
```

Persona: DevOps Engineer | Skill: `INFRA_STANDARD` | Reads: `docs/brd.md`, `docs/architecture.md`, Phase 13 docs

Generates Dockerfiles, Docker Compose, CI/CD pipeline, env templates, health checks, and production deployment checklist.

**Gate:** Does Docker Compose work locally? Does CI/CD match your infrastructure?

---

## Workflow Order

```
Phase 1 — BRD (VERIFY)
  └── Phase 2 — Planning
        └── Phase 3 — Architecture
              ├── Backend Track:  Phase 4a → 4b → 5 → 6    (can run in parallel with Phase 7)
              └── Design Track:   Phase 7
                                        ↘
              Both tracks complete → Phase 8 → 9 → 10 → 11 → 12 → 13 → 14
```

After Phase 3, the backend track and design track can run in parallel (two separate Claude Code sessions).

**Backend track order:** Phase 4a generates all Prisma models first → Phase 4b generates modules one by one against the stable schema.

---

## Code Review Checkpoints

Run `/phase12-review` at these points — don't wait until the end:

| When                                | Why                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| After first backend module (4b)     | Catch pattern-level issues before generating more modules |
| After backend track (Phases 4a-6)   | Cross-module consistency, migration correctness           |
| After first frontend page           | Catch UI pattern issues before generating more pages      |
| After frontend track (Phases 8-10)  | Cross-page consistency, API contract alignment            |
| After E2E (Phase 11)                | Final security + performance sweep                        |

---

## Skills

Skills are reusable reference documents encoding your conventions. They survive across projects and improve over time.

| Skill                      | Status                         | Used In           |
| -------------------------- | ------------------------------ | ----------------- |
| `BRD_FORMAT.md`            | ✅ Ready                       | Phase 1           |
| `MODULE_TEMPLATE.md`       | ✅ Ready                       | Phase 4a, 4b      |
| `API_STANDARD.md`          | ✅ Ready                       | Phase 8           |
| `ARCHITECTURE_STANDARD.md` | Created by Phase 3             | Phase 3, 4a, 4b, 12 |
| `TESTING_CONVENTIONS.md`   | Created by Phase 5             | Phase 5, 10       |
| Style Guide (in `ui-design.md`) | Created per-project by Phase 7 | Phase 9      |
| `MIGRATION_TEMPLATE.md`    | Add when ready                 | Phase 6           |
| `E2E_PATTERNS.md`          | Add when ready                 | Phase 11          |
| `REVIEW_CHECKLIST.md`      | Add when ready                 | Phase 12          |
| `DOC_TEMPLATES.md`         | Add when ready                 | Phase 13          |
| `INFRA_STANDARD.md`        | Add when ready                 | Phase 14          |

Skills you don't have yet won't block you — the phase commands handle missing skills gracefully. After your first project, extract patterns from what worked into new skill docs.

---

## Extending

**Add a skill:** Create a `.md` file in `skills/` (Purpose → Rules → Templates → Examples → Anti-patterns). The relevant phase command will pick it up automatically.

**Add a persona:** Create a `.md` file in `personas/` (Identity → Perspective → Priorities → What You Produce → What You Do Not Do).

**Refine over time:** When you correct the AI's output, note what you changed. If the same correction happens twice, add a rule to the relevant skill doc.
