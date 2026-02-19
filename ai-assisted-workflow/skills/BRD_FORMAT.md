# BRD Format Standard

## Purpose

Defines the structure for the Business Requirements Document (BRD). The BRD is the anchor for the entire workflow — every downstream phase references it. This format ensures requirements are complete, testable, and traceable.

**Scope:** This workflow targets MVP only. Everything in the BRD body is MVP scope. Features that are out of MVP scope belong in Section 8 (Out of Scope) and are never spec'd in detail.

## Document Structure

```
# [Project Name] — Business Requirements Document
## Index
  - Table of Contents
  - Module Index
  - Requirement Index
  - User Story Index
## 1. Overview
## 2. Objectives
## 3. User Roles
## 4. User Stories
### 4.x [US_ID] — [Story Title]
## 5. Modules
### 5.x [MODULE_ID] — [Module Name]
#### Requirements
##### [REQ_ID] — [Requirement Title]
#### Error States
## 6. Non-Functional Requirements
## 7. Assumptions & Constraints
## 8. Out of Scope
```

## Rules

### Index

The BRD must open with an `## Index` section immediately after the document title. This allows fast navigation in long documents without scrolling through hundreds of lines.

The index has four parts:

**1. Table of Contents** — anchor links to every top-level section and each module subsection:

```markdown
### Table of Contents

- [1. Overview](#1-overview)
- [2. Objectives](#2-objectives)
- [3. User Roles](#3-user-roles)
- [4. User Stories](#4-user-stories)
  - [Page Manifest](#page-manifest-derived-from-user-stories)
- [5. Modules](#5-modules)
  - [5.1 AUTH — Authentication & Authorization](#51-auth--authentication--authorization)
  - [5.2 USERS — User Management](#52-users--user-management)
- [6. Non-Functional Requirements](#6-non-functional-requirements)
- [7. Assumptions & Constraints](#7-assumptions--constraints)
- [8. Out of Scope](#8-out-of-scope)
```

**2. Module Index** — one row per module for quick lookup:

```markdown
### Module Index

| Module ID | Name                           | Section                                        |
| --------- | ------------------------------ | ---------------------------------------------- |
| AUTH      | Authentication & Authorization | [5.1](#51-auth--authentication--authorization) |
| USERS     | User Management                | [5.2](#52-users--user-management)              |
```

**3. Requirement Index** — one row per requirement ID, sorted by module:

```markdown
### Requirement Index

| Req ID    | Title             | Module | Priority |
| --------- | ----------------- | ------ | -------- |
| AUTH-001  | User Registration | AUTH   | MVP      |
| AUTH-002  | User Login        | AUTH   | MVP      |
| USERS-001 | View User Profile | USERS  | MVP      |
```

**4. User Story Index** — one row per story ID:

```markdown
### User Story Index

| Story ID | Title                  | Module    | Pages         | Priority |
| -------- | ---------------------- | --------- | ------------- | -------- |
| US-001   | Register a new account | AUTH      | RegisterPage  | MVP      |
| US-002   | Log in to the platform | AUTH      | LoginPage     | MVP      |
| US-003   | View my dashboard      | DASHBOARD | DashboardPage | MVP      |
```

Generate the index **last**, after all sections are written, so IDs and titles are final. The index is read-only reference — it must exactly mirror what is in the document body.

### Module IDs

Every module needs a short uppercase identifier in its heading:

```markdown
### 4.1 AUTH — Authentication & Authorization

### 4.2 USERS — User Management

### 4.3 PROJECTS — Project Management
```

This ID is how you reference modules across phases (e.g., `/phase4-backend AUTH`). Keep them uppercase, unique, and stable — don't rename once assigned.

### Requirement IDs

Every requirement gets a unique ID: `[MODULE_ID]-[NNN]`

Examples: `AUTH-001`, `AUTH-002`, `USERS-001`

Sequential within each module, starting at `001`. Never reuse an ID even if a requirement is removed.

### Requirement Structure

Every requirement must include:

```markdown
##### AUTH-001 — User Registration

**Description:**
1–2 sentences from the user's perspective. No implementation detail.

**Acceptance Criteria:**

- GIVEN [precondition], WHEN [action], THEN [expected outcome]
- GIVEN [precondition], WHEN [action], THEN [expected outcome]

**Error States:**

- WHEN [error condition], THEN [system behavior] → `ERROR_CODE`

**Priority:** MVP | Post-MVP
```

### User Stories

User stories describe what users need to accomplish. Each story maps to one or more pages in the UI — this is how Phase 7 (UI Design) and Phase 10 (Pages) know what to build.

#### Story IDs

Every story gets a unique ID: `US-[NNN]`

Examples: `US-001`, `US-002`, `US-003`

Sequential, starting at `001`. Never reuse an ID even if a story is removed.

#### Story Structure

```markdown
#### US-001 — Register a new account

**As a** visitor,
**I want to** create an account with my email and password,
**So that** I can access the platform's features.

**Module:** AUTH
**Pages:** RegisterPage
**Priority:** MVP
```

- **As a / I want to / So that** — standard user story format. The role must match a role from the User Roles table.
- **Module** — which module this story belongs to. Must match a Module ID from Section 5.
- **Pages** — the page(s) this story implies. Comma-separated if multiple. These become the page list for Phase 7 and Phase 10.
- **Priority** — MVP or Post-MVP. Post-MVP stories must not have pages assigned and should be moved to Section 8.

#### Deriving Pages from Stories

After writing all stories, collect the unique page names from the **Pages** fields. This becomes your page manifest. Group related stories that share a page:

```markdown
### Page Manifest (derived from User Stories)

| Page          | Stories        | Route        |
| ------------- | -------------- | ------------ |
| LoginPage     | US-001, US-002 | /login       |
| DashboardPage | US-005, US-006 | /dashboard   |
| UserListPage  | US-010         | /admin/users |
```

This table is the source of truth for Phase 7 (what to design) and Phase 10 (what to build).

### Acceptance Criteria

Use Given/When/Then format. Each criterion must be independently testable. Minimum 2 per requirement.

**Good:**

```
- GIVEN a registered user, WHEN they submit valid credentials, THEN they receive an access token and refresh token
- GIVEN a registered user, WHEN they submit an incorrect password 5 times, THEN the account is locked for 15 minutes
```

**Bad:**

```
- The login should work properly
- Users can log in with their credentials
```

### Error States

Every failure path needs an error code and user-facing behavior:

```
- WHEN email is already registered, THEN show "An account with this email already exists" → `EMAIL_EXISTS`
- WHEN account is locked, THEN show "Account temporarily locked. Try again in {minutes} minutes" → `ACCOUNT_LOCKED`
```

Each module also has a cross-cutting error states table for shared errors (auth failures, rate limits, etc.):

```markdown
| Error Code     | Condition                | User-Facing Behavior             |
| -------------- | ------------------------ | -------------------------------- |
| `UNAUTHORIZED` | Missing or expired token | Redirect to login page           |
| `FORBIDDEN`    | Insufficient role        | Show "You don't have permission" |
```

### Section Guidelines

- **Overview:** 2–3 sentences. What the app is, who it's for. No implementation details.
- **Objectives:** 3–5 measurable MVP goals. "Users can register and log in on day one" not "improve UX."
- **User Roles:** Table with role, description, key permissions. MVP roles only.
- **User Stories:** Every MVP user-facing interaction as a story. Post-MVP stories are not written — just listed by name in Section 8.
- **Modules:** Core of the BRD. Order by independence — modules with no dependencies first.
- **Non-Functional Requirements:** Measurable targets (e.g., "API response < 200ms at p95"). MVP-relevant only.
- **Assumptions & Constraints:** Tech choices, business constraints, integration assumptions.
- **Out of Scope:** Explicit list of what's NOT in the MVP. This is where Post-MVP features live — names only, no specs.

### Priority

Every requirement and user story has a single priority field: **MVP** or **Post-MVP**.

- **MVP** — required for launch. If it's not needed to ship a working product, it's not MVP.
- **Post-MVP** — desired but deferred. Do not spec these in the BRD body. List them only in Section 8 (Out of Scope) by name.

If a feature is in the BRD body, it is MVP by definition. Post-MVP items that appear in the body are scope creep — move them to Section 8 and remove the full spec.

### Condensing the BRD

Long BRDs consume more tokens in every downstream phase that loads them. Keep the document as tight as possible without losing testability.

**Rules for staying concise:**

- **Descriptions:** 1–2 sentences max. No background, rationale, or implementation notes.
- **Acceptance criteria:** Write only what is needed to verify the requirement. Do not document obvious behavior (e.g., "GIVEN a form, WHEN submitted, THEN it submits" adds nothing).
- **Error states:** Merge error codes that have identical system behavior. One row per distinct behavior, not per input variant.
- **Prose sections (Overview, Objectives, Assumptions):** Use bullet points and tables rather than paragraphs wherever possible.
- **Out of Scope:** Names only — no descriptions. "Bulk CSV export" is enough; no need to explain what it would have done.
- **No redundant cross-references:** Only add "Cross-module impact" notes when a cascade is non-obvious.
- **No placeholder text:** Remove scaffolding like `[Continue for all user-facing interactions...]` before delivering the BRD.

**Target length:** A BRD with 4–6 modules and 20–30 requirements should fit in 400–600 lines. If it's growing beyond that, look for prose that can become a table, or Post-MVP scope that crept into the body.

## Template

```markdown
# [Project Name] — Business Requirements Document

## Index

### Table of Contents

- [1. Overview](#1-overview)
- [2. Objectives](#2-objectives)
- [3. User Roles](#3-user-roles)
- [4. User Stories](#4-user-stories)
  - [Page Manifest](#page-manifest-derived-from-user-stories)
- [5. Modules](#5-modules)
  - [5.1 AUTH — Authentication & Authorization](#51-auth--authentication--authorization)
  - [5.2 NEXT_MODULE — Module Name](#52-next_module--module-name)
- [6. Non-Functional Requirements](#6-non-functional-requirements)
- [7. Assumptions & Constraints](#7-assumptions--constraints)
- [8. Out of Scope](#8-out-of-scope)

### Module Index

| Module ID | Name                           | Section                                        |
| --------- | ------------------------------ | ---------------------------------------------- |
| AUTH      | Authentication & Authorization | [5.1](#51-auth--authentication--authorization) |

### Requirement Index

| Req ID   | Title             | Module | Priority |
| -------- | ----------------- | ------ | -------- |
| AUTH-001 | User Registration | AUTH   | MVP      |

### User Story Index

| Story ID | Title                  | Module    | Pages         | Priority |
| -------- | ---------------------- | --------- | ------------- | -------- |
| US-001   | Register a new account | AUTH      | RegisterPage  | MVP      |
| US-002   | Log in to the platform | AUTH      | LoginPage     | MVP      |
| US-003   | View my dashboard      | DASHBOARD | DashboardPage | MVP      |

---

## 1. Overview

[What is this app? Who is it for? What problem does it solve? 2–3 sentences.]

## 2. Objectives

- [Measurable MVP objective 1]
- [Measurable MVP objective 2]
- [Measurable MVP objective 3]

## 3. User Roles

| Role   | Description                 | Key Permissions                    |
| ------ | --------------------------- | ---------------------------------- |
| Admin  | Full system access          | Manage users, configure settings   |
| Member | Standard authenticated user | Create, read, update own resources |

## 4. User Stories

#### US-001 — Register a new account

**As a** visitor,
**I want to** create an account with my email and password,
**So that** I can access the platform's features.

**Module:** AUTH
**Pages:** RegisterPage
**Priority:** MVP

#### US-002 — Log in to the platform

**As a** member,
**I want to** log in with my credentials,
**So that** I can access my account.

**Module:** AUTH
**Pages:** LoginPage
**Priority:** MVP

#### US-003 — View my dashboard

**As a** member,
**I want to** see an overview of my activity,
**So that** I can quickly navigate to what matters.

**Module:** DASHBOARD
**Pages:** DashboardPage
**Priority:** MVP

### Page Manifest (derived from User Stories)

| Page          | Stories | Route      |
| ------------- | ------- | ---------- |
| RegisterPage  | US-001  | /register  |
| LoginPage     | US-002  | /login     |
| DashboardPage | US-003  | /dashboard |

## 5. Modules

### 5.1 AUTH — Authentication & Authorization

#### Requirements

##### AUTH-001 — User Registration

**Description:**
A new user can create an account by providing their email, password, and display name.

**Acceptance Criteria:**

- GIVEN a visitor, WHEN they submit a valid email, password, and display name, THEN an account is created and a verification email is sent
- GIVEN a visitor, WHEN they click the verification link within 24 hours, THEN the account becomes active

**Error States:**

- WHEN email is already registered, THEN show "An account with this email already exists" → `EMAIL_EXISTS`
- WHEN password doesn't meet requirements, THEN show specific missing criteria → `WEAK_PASSWORD`

**Priority:** MVP

#### Error States

| Error Code     | Condition                | User-Facing Behavior                      |
| -------------- | ------------------------ | ----------------------------------------- |
| `UNAUTHORIZED` | Missing or expired token | Redirect to login page                    |
| `RATE_LIMITED` | Too many requests        | Show "Too many attempts. Try again later" |

---

### 5.2 [NEXT_MODULE] — [Module Name]

[Repeat structure...]

## 6. Non-Functional Requirements

- **Performance:** API response < 200ms at p95
- **Security:** All endpoints require authentication except public routes

## 7. Assumptions & Constraints

- [Assumption or constraint]

## 8. Out of Scope

Post-MVP features (names only — not spec'd):

- [Feature explicitly excluded]
- [Feature explicitly excluded]
```

## Anti-Patterns

1. **Implementation in requirements** — The BRD describes _what_, not _how_. Don't mention databases, frameworks, or API shapes. That's Phase 3's job.
2. **Vague acceptance criteria** — "Should work correctly" is not testable. Every criterion needs a specific precondition, action, and observable outcome.
3. **Missing error states** — If a requirement can fail, document how. Zero error states almost always means incomplete analysis.
4. **Post-MVP scope in the body** — If a feature has full acceptance criteria and error states, it's treated as MVP by downstream phases. Don't spec things you won't build at launch — list them in Section 8 by name only.
5. **Cross-module requirements without cross-references** — If deleting a user cascades to projects, note it: "Cross-module impact: see PROJECTS-005."
6. **Stale index** — The index must mirror the document exactly. If a requirement is added or renamed, update all four index tables. An index that doesn't match the body is worse than no index.
7. **Prose bloat** — Paragraphs where a table or bullet list would do, or long descriptions that repeat what acceptance criteria already say. Every extra line loads into every downstream phase — keep it tight.
