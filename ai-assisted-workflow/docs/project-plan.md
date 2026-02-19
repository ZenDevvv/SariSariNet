# Project Plan & Estimation

Generated from `ai-assisted-workflow/docs/brd.md` on 2026-02-19.

## Planning Assumptions

- Sprint length: 2 weeks.
- Effective capacity: 90 hours per sprint (AI-assisted implementation plus human review and QA).
- Estimates include implementation, review cycles, testing, and bug fixing.
- Priority policy: Must-have before Should-have before Nice-to-have within each module.
- Build order policy: independent-first by model dependencies, then dependent modules.

## 1) Module Breakdown With Task-Level Estimates (Hours)

### FOUNDATION (Cross-Module)

| Task | Hours | BRD Trace |
|---|---:|---|
| Project scaffolding, environment setup, CI workflow | 8 | NFR: Availability, Security |
| Migration baseline, seed data, naming conventions | 6 | All modules |
| Shared auth middleware, authorization policy hooks, common error envelope | 8 | NFR: Security |
| Test harness (unit/integration/e2e), fixtures, contract test setup | 8 | All modules |
| Observability baseline (structured logs, metrics, audit event plumbing) | 8 | NFR: Auditability, Data Freshness |
| File upload security baseline (type/size validation and scanner interface) | 6 | NFR: File Handling |
| **Total** | **44** | |

### IDENTITY

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`users`, `auth_sessions`, `account_recovery_tokens`, `account_status_events`) | 8 | IDENTITY-001, IDENTITY-003, IDENTITY-004 |
| Register/sign-in API and rate-limiting integration | 12 | IDENTITY-001 |
| Recovery request/confirm flow and token lifecycle | 8 | IDENTITY-003 |
| Profile/storefront update API and validation rules | 8 | IDENTITY-002 |
| Account deactivation flow with historical-data safeguards | 6 | IDENTITY-004 |
| Frontend flows (`/register`, `/login`, `/account/recovery`, `/settings/profile`) | 10 | IDENTITY-001, IDENTITY-002, IDENTITY-003, IDENTITY-004 |
| Test coverage and review iterations | 12 | IDENTITY-* |
| **Total** | **64** | |

### CONNECTIONS

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`connection_requests`, `connections`, `connection_notifications`) | 8 | CONNECTIONS-001, CONNECTIONS-003 |
| Request lifecycle API (send, accept, reject, remove) | 12 | CONNECTIONS-001 |
| Network state list APIs (incoming/outgoing/active, pagination) | 8 | CONNECTIONS-002 |
| Notification dispatch/read-state APIs | 8 | CONNECTIONS-003 |
| Frontend updates (`/users/:userId`, `/connections/requests`, `/connections`) | 12 | CONNECTIONS-001, CONNECTIONS-002 |
| Tests and visibility-integration contract tests | 10 | CONNECTIONS-* |
| **Total** | **58** | |

### ORGS

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`organizations`, `organization_memberships`, `organization_invites`, `organization_join_requests`) | 8 | ORGS-001, ORGS-002 |
| Create/invite/join/approve APIs | 12 | ORGS-001, ORGS-002 |
| Membership role/roster/remove APIs with last-admin guard | 10 | ORGS-003 |
| Active-organization context switch API and session propagation | 6 | ORGS-004 |
| Frontend updates (`/organizations`, `/organizations/:orgId`) | 10 | ORGS-001, ORGS-002, ORGS-003, ORGS-004 |
| Tests and authorization edge cases | 8 | ORGS-* |
| **Total** | **54** | |

### BORROWING

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`borrowing_records`, `repayments`, `borrowing_audit_entries`, `settlement_notes`) | 8 | BORROWING-001, BORROWING-003, BORROWING-004 |
| Borrowing/lending record creation API and validations | 8 | BORROWING-001 |
| Repayment posting API and status progression engine | 10 | BORROWING-002 |
| History, remaining balance, overdue query APIs | 8 | BORROWING-003, BORROWING-004 |
| Frontend updates (`/borrowing/new`, `/borrowing/:recordId`) | 14 | BORROWING-001, BORROWING-002, BORROWING-003, BORROWING-004 |
| Tests, audit integrity checks, reconciliation checks | 12 | BORROWING-* |
| **Total** | **60** | |

### MARKETPLACE

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`product_listings`, `listing_lifecycle_events`, `suggestion_layout_preferences`) | 10 | MARKETPLACE-001, MARKETPLACE-005, MARKETPLACE-006 |
| Listing create/edit/archive lifecycle APIs | 14 | MARKETPLACE-001, MARKETPLACE-005 |
| Public browse/search APIs and indexing | 10 | MARKETPLACE-003 |
| Private visibility policy engine (connection/shared-org checks) | 14 | MARKETPLACE-002, MARKETPLACE-004 |
| Seller profile listing API with relationship gating | 6 | MARKETPLACE-004 |
| Suggestion feed API and layout preference persistence | 6 | MARKETPLACE-006 |
| Frontend updates (`/products/new`, `/marketplace`, `/search`, `/users/:userId`, `/suggestions`) | 20 | MARKETPLACE-* |
| Tests (privacy, permission, and performance scenarios) | 12 | MARKETPLACE-* |
| **Total** | **92** | |

### TRANSACTIONS

| Task | Hours | Requirement IDs |
|---|---:|---|
| Data model and migrations (`transactions`, `transaction_invoices`, `transaction_adjustments`, `transaction_metric_snapshots`) | 10 | TRANSACTIONS-001, TRANSACTIONS-002, TRANSACTIONS-004 |
| Create/detail transaction APIs with participant validation | 10 | TRANSACTIONS-001 |
| Invoice upload validation and scanner integration | 10 | TRANSACTIONS-002 |
| Adjustment/void APIs with immutable audit trail | 10 | TRANSACTIONS-004 |
| Metrics recalculation jobs and freshness instrumentation | 12 | TRANSACTIONS-003 |
| Frontend updates (`/transactions/new`, `/transactions/:transactionId`, `/dashboard/commerce`) | 14 | TRANSACTIONS-001, TRANSACTIONS-002, TRANSACTIONS-003, TRANSACTIONS-004 |
| Tests (financial reconciliation, audit consistency, failure paths) | 12 | TRANSACTIONS-* |
| **Total** | **78** | |

### REPORTING

| Task | Hours | Requirement IDs |
|---|---:|---|
| Aggregation layer for commerce + borrowing KPIs | 12 | REPORTING-001 |
| Dashboard APIs with filter validation and partial-data fallback | 10 | REPORTING-001 |
| Report preset and export APIs | 10 | REPORTING-002 |
| Frontend updates (`/dashboard/commerce`, `/dashboard/borrowing`, `/reports`) | 12 | REPORTING-001, REPORTING-002 |
| Export generation pipeline and status polling | 8 | REPORTING-002 |
| Tests and performance checks | 10 | REPORTING-* |
| **Total** | **62** | |

### HARDENING AND RELEASE

| Task | Hours | BRD Trace |
|---|---:|---|
| End-to-end regression execution and defect resolution | 16 | All Must-have requirements |
| Performance tuning to NFR targets (search/dashboard p95) | 12 | NFR: Performance |
| Security and authorization review (private visibility, file handling, audit trails) | 10 | NFR: Security, File Handling, Auditability |
| UAT cycle, release checklist, rollback plan validation | 10 | NFR: Availability |
| **Total** | **48** | |

### Effort Summary

| Area | Hours |
|---|---:|
| Foundation | 44 |
| Identity | 64 |
| Connections | 58 |
| Organizations | 54 |
| Borrowing | 60 |
| Marketplace | 92 |
| Transactions | 78 |
| Reporting | 62 |
| Hardening | 48 |
| **Grand Total** | **560** |

## 2) Sprint and Milestone Plan (Prioritized Build Order)

### Build Order (Independent-First)

1. FOUNDATION
2. IDENTITY
3. CONNECTIONS and ORGS (parallel after IDENTITY)
4. BORROWING (parallel track after IDENTITY)
5. MARKETPLACE (after CONNECTIONS and ORGS for privacy rules)
6. TRANSACTIONS (after MARKETPLACE core data contracts)
7. REPORTING (after TRANSACTIONS and BORROWING)
8. HARDENING and RELEASE

### Sprint Plan

| Sprint | Target Hours | Planned Scope | Exit Criteria |
|---|---:|---|---|
| Sprint 1 | 90 | FOUNDATION + IDENTITY core (`IDENTITY-001`, `IDENTITY-003`) | Auth and recovery flows usable end-to-end in dev |
| Sprint 2 | 90 | Finish IDENTITY (`IDENTITY-002`, `IDENTITY-004`) + start CONNECTIONS and ORGS core | User profile and account state stable; relationship/org APIs in place |
| Sprint 3 | 90 | Finish CONNECTIONS + finish ORGS + start BORROWING core | Connection and org membership data ready for visibility checks |
| Sprint 4 | 90 | Finish BORROWING + MARKETPLACE core (`MARKETPLACE-001`, `MARKETPLACE-003`) | Product CRUD plus public browse/search complete |
| Sprint 5 | 90 | MARKETPLACE privacy/lifecycle/suggestions (`MARKETPLACE-002`, `MARKETPLACE-004`, `MARKETPLACE-005`, `MARKETPLACE-006`) + TRANSACTIONS core start | Private listing rules validated against connection/org states |
| Sprint 6 | 90 | Finish TRANSACTIONS + REPORTING core (`REPORTING-001`) | Commerce metrics and borrowing summaries available on dashboards |
| Sprint 7 | 90 | REPORTING exports/presets (`REPORTING-002`) + HARDENING and RELEASE | NFR gates met; regression suite and UAT pass |

### Parallel Tracks

- Track A: CONNECTIONS + ORGS (required for marketplace privacy checks).
- Track B: BORROWING (can run after IDENTITY in parallel with Track A).
- Track C: Marketplace frontend shell can start while policy engine backend is being finalized.
- Track D: Reporting UI skeleton can start once dashboard API contracts are frozen.

## 3) Dependency Map (Requirement ID -> Model -> Routes -> Frontend Page)

API routes below are proposed implementation contracts derived from BRD requirements.

| Requirement ID | Data Model(s) | API Route(s) | Frontend Page(s) |
|---|---|---|---|
| IDENTITY-001 | `users`, `auth_sessions` | `POST /api/auth/register`, `POST /api/auth/login` | `RegisterPage (/register)`, `LoginPage (/login)` |
| IDENTITY-002 | `users` (profile/storefront fields) | `GET /api/users/me`, `PATCH /api/users/me/profile` | `ProfileSettingsPage (/settings/profile)` |
| IDENTITY-003 | `account_recovery_tokens` | `POST /api/auth/recovery/request`, `POST /api/auth/recovery/confirm` | `AccountRecoveryPage (/account/recovery)` |
| IDENTITY-004 | `users` (active/deactivated), `account_status_events` | `POST /api/users/me/deactivate` | `ProfileSettingsPage (/settings/profile)` |
| CONNECTIONS-001 | `connection_requests`, `connections` | `POST /api/connections/requests`, `PATCH /api/connections/requests/:requestId`, `DELETE /api/connections/:connectionId` | `UserProfilePage (/users/:userId)`, `ConnectionRequestsPage (/connections/requests)`, `ConnectionsPage (/connections)` |
| CONNECTIONS-002 | `connection_requests`, `connections` | `GET /api/connections/requests/incoming`, `GET /api/connections/requests/outgoing`, `GET /api/connections` | `ConnectionRequestsPage (/connections/requests)`, `ConnectionsPage (/connections)` |
| CONNECTIONS-003 | `connection_notifications` | `GET /api/notifications/connections`, `PATCH /api/notifications/:id/read` | `Authenticated shell notifications (all protected pages)` |
| ORGS-001 | `organizations`, `organization_memberships` | `POST /api/organizations`, `GET /api/organizations` | `OrganizationsPage (/organizations)` |
| ORGS-002 | `organization_invites`, `organization_join_requests`, `organization_memberships` | `POST /api/organizations/:orgId/invites`, `POST /api/organizations/:orgId/join-requests`, `PATCH /api/organizations/:orgId/memberships/:membershipId/approve` | `OrganizationDetailPage (/organizations/:orgId)` |
| ORGS-003 | `organization_memberships` | `PATCH /api/organizations/:orgId/memberships/:membershipId/role`, `DELETE /api/organizations/:orgId/memberships/:membershipId`, `GET /api/organizations/:orgId/memberships` | `OrganizationDetailPage (/organizations/:orgId)` |
| ORGS-004 | `user_active_organization_context` | `GET /api/users/me/organizations`, `PUT /api/users/me/active-organization` | `OrganizationsPage (/organizations)`, `OrganizationDetailPage (/organizations/:orgId)` |
| BORROWING-001 | `borrowing_records` | `POST /api/borrowing` | `BorrowingCreatePage (/borrowing/new)` |
| BORROWING-002 | `repayments`, `borrowing_records` | `POST /api/borrowing/:recordId/repayments` | `BorrowingDetailPage (/borrowing/:recordId)` |
| BORROWING-003 | `repayments`, `borrowing_audit_entries` | `GET /api/borrowing/:recordId`, `GET /api/borrowing/:recordId/repayments` | `BorrowingDetailPage (/borrowing/:recordId)` |
| BORROWING-004 | `borrowing_records`, `settlement_notes` | `PATCH /api/borrowing/:recordId/settlement-note`, `GET /api/borrowing?status=overdue` | `BorrowingDetailPage (/borrowing/:recordId)`, `BorrowingDashboardPage (/dashboard/borrowing)` |
| MARKETPLACE-001 | `product_listings` | `POST /api/products`, `PATCH /api/products/:productId` | `ProductEditorPage (/products/new)` |
| MARKETPLACE-002 | `product_listings`, `connections`, `organization_memberships` | `GET /api/products/:productId`, `GET /api/users/:userId/listings` | `UserProfilePage (/users/:userId)` |
| MARKETPLACE-003 | `product_listings` | `GET /api/marketplace`, `GET /api/search` | `MarketplacePage (/marketplace)`, `SearchResultsPage (/search)` |
| MARKETPLACE-004 | `product_listings`, `connections`, `organization_memberships` | `GET /api/users/:userId/listings` | `UserProfilePage (/users/:userId)` |
| MARKETPLACE-005 | `product_listings`, `listing_lifecycle_events` | `PATCH /api/products/:productId/archive`, `PATCH /api/products/:productId/unarchive`, `PATCH /api/products/:productId/inventory` | `ProductEditorPage (/products/new)`, `UserProfilePage (/users/:userId)` |
| MARKETPLACE-006 | `suggestion_layout_preferences`, `product_listings` | `GET /api/suggestions`, `PUT /api/users/me/suggestion-layout` | `SuggestionsFeedPage (/suggestions)` |
| TRANSACTIONS-001 | `transactions` | `POST /api/transactions`, `GET /api/transactions/:transactionId` | `TransactionCreatePage (/transactions/new)`, `TransactionDetailPage (/transactions/:transactionId)` |
| TRANSACTIONS-002 | `transaction_invoices` | `POST /api/transactions/:transactionId/invoice` | `TransactionCreatePage (/transactions/new)`, `TransactionDetailPage (/transactions/:transactionId)` |
| TRANSACTIONS-003 | `transaction_metric_snapshots` | `GET /api/dashboard/commerce` | `CommerceDashboardPage (/dashboard/commerce)` |
| TRANSACTIONS-004 | `transaction_adjustments` | `POST /api/transactions/:transactionId/adjustments`, `POST /api/transactions/:transactionId/void` | `TransactionDetailPage (/transactions/:transactionId)` |
| REPORTING-001 | `transaction_metric_snapshots`, `borrowing_metric_snapshots` | `GET /api/dashboard/commerce`, `GET /api/dashboard/borrowing` | `CommerceDashboardPage (/dashboard/commerce)`, `BorrowingDashboardPage (/dashboard/borrowing)` |
| REPORTING-002 | `report_view_presets`, `report_export_jobs` | `POST /api/reports/presets`, `GET /api/reports/presets`, `POST /api/reports/export` | `ReportsPage (/reports)` |

## 4) Dependency Graph Summary

| Module | Depends On | Dependency Type |
|---|---|---|
| FOUNDATION | None | Platform baseline |
| IDENTITY | FOUNDATION | Required for all authenticated flows |
| CONNECTIONS | IDENTITY | Foreign keys to users |
| ORGS | IDENTITY | Foreign keys to users |
| BORROWING | IDENTITY | Foreign keys to users |
| MARKETPLACE | IDENTITY, CONNECTIONS, ORGS | Seller identity plus private-visibility checks |
| TRANSACTIONS | IDENTITY, MARKETPLACE | User identities and product context |
| REPORTING | TRANSACTIONS, BORROWING | Aggregates from financial and borrowing data |
| HARDENING | All prior modules | Integration and release quality gates |

## 5) Risk Register

| Risk ID | Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|---|
| R1 | Private listing exposure due to visibility-rule defects | Medium | High | Implement deny-by-default visibility policy, add integration tests for all relationship permutations, add security review gate before release |
| R2 | KPI mismatch between transactions, adjustments, and dashboards | Medium | High | Create reconciliation tests, immutable adjustment audit checks, and snapshot-diff alerts in CI |
| R3 | Invoice upload security or scanner integration delays | Medium | Medium | Use async upload pipeline with quarantine state, define scanner stub early in Sprint 1, keep feature flag fallback |
| R4 | Ambiguity on transaction-product linkage and correction permissions | Medium | Medium | Run requirement clarification workshop in Sprint 1, lock API contracts in decision log |
| R5 | Search/dashboard p95 targets not met at scale | Medium | High | Add indexes and query profiling early, include performance test data set before Sprint 6 |
| R6 | Cross-module sequencing causes idle time or rework | Medium | Medium | Maintain dependency board, enforce API contract freeze before frontend integration |
| R7 | Audit trail immutability accidentally broken during adjustments/repayments | Low | High | Write append-only repository constraints and mutation guards with dedicated tests |
| R8 | Status-state bugs in borrowing repayment progression | Medium | Medium | Model status transitions as explicit state machine with transition test matrix |

## 6) Critical Path Identification

Critical path tasks (delay here delays release):

1. FOUNDATION completion (44h)
2. IDENTITY completion (64h)
3. CONNECTIONS completion for privacy prerequisites (58h)
4. MARKETPLACE completion including visibility engine (92h)
5. TRANSACTIONS completion including metrics (78h)
6. REPORTING completion (62h)
7. HARDENING and RELEASE gates (48h)

Critical-path effort: **446h**.

Near-critical track:

- ORGS (54h) runs with CONNECTIONS; low float because MARKETPLACE visibility needs both.
- BORROWING (60h) can run in parallel after IDENTITY, but must finish before REPORTING integration freeze.

## 7) Review Gate

- Are estimates realistic? **Yes.** Plan includes explicit testing/review/hardening effort (about 23% of total hours across module tests and release hardening).
- Is the build order logical? **Yes.** Independent modules are built first, and dependent modules are sequenced only after prerequisite data contracts exist.
- Does the dependency map make sense? **Yes.** All BRD requirement IDs are traced to models, API routes, and frontend pages; no orphan requirements remain.

Gate status: **PASS**.

## 8) Notes for Execution

- Lock API contracts at each sprint boundary to reduce frontend/backend rework.
- Keep Must-have requirements as non-negotiable scope for MVP; move Should/Nice if schedule risk materializes.
- Update `docs/changes.md` and `docs/decision-log.md` whenever scope or dependency assumptions change.
