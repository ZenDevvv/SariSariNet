# SariSariNet Marketplace - Business Requirements Document

## Index

### Table of Contents

- [1. Overview](#1-overview)
- [2. Objectives](#2-objectives)
- [3. User Roles](#3-user-roles)
- [4. User Stories](#4-user-stories)
  - [Page Manifest](#page-manifest-derived-from-user-stories)
- [5. Modules](#5-modules)
  - [5.1 IDENTITY - Identity and Access](#51-identity---identity-and-access)
  - [5.2 CONNECTIONS - User Connections](#52-connections---user-connections)
  - [5.3 ORGS - Organization Management](#53-orgs---organization-management)
  - [5.4 BORROWING - Borrowing and Lending](#54-borrowing---borrowing-and-lending)
  - [5.5 MARKETPLACE - Product Catalog and Discovery](#55-marketplace---product-catalog-and-discovery)
  - [5.6 TRANSACTIONS - Sales and Financial Records](#56-transactions---sales-and-financial-records)
  - [5.7 REPORTING - Dashboards and Reports](#57-reporting---dashboards-and-reports)
- [6. Non-Functional Requirements](#6-non-functional-requirements)
- [7. Assumptions and Constraints](#7-assumptions-and-constraints)
- [8. Out of Scope](#8-out-of-scope)

### Module Index

| Module ID | Name | Section |
| --------- | ---- | ------- |
| IDENTITY | Identity and Access | [5.1](#51-identity---identity-and-access) |
| CONNECTIONS | User Connections | [5.2](#52-connections---user-connections) |
| ORGS | Organization Management | [5.3](#53-orgs---organization-management) |
| BORROWING | Borrowing and Lending | [5.4](#54-borrowing---borrowing-and-lending) |
| MARKETPLACE | Product Catalog and Discovery | [5.5](#55-marketplace---product-catalog-and-discovery) |
| TRANSACTIONS | Sales and Financial Records | [5.6](#56-transactions---sales-and-financial-records) |
| REPORTING | Dashboards and Reports | [5.7](#57-reporting---dashboards-and-reports) |
### Requirement Index

| Req ID | Title | Module | Priority |
| ------ | ----- | ------ | -------- |
| IDENTITY-001 | Register and Sign In | IDENTITY | Must-have |
| IDENTITY-002 | Manage Profile and Storefront Details | IDENTITY | Should-have |
| IDENTITY-003 | Recover Account Access | IDENTITY | Must-have |
| IDENTITY-004 | Deactivate Account | IDENTITY | Nice-to-have |
| CONNECTIONS-001 | Manage Connection Requests and Removal | CONNECTIONS | Must-have |
| CONNECTIONS-002 | View Connection Network State | CONNECTIONS | Should-have |
| CONNECTIONS-003 | Connection Activity Notifications | CONNECTIONS | Nice-to-have |
| ORGS-001 | Create Organization | ORGS | Must-have |
| ORGS-002 | Invite, Join, and Approve Members | ORGS | Must-have |
| ORGS-003 | Manage Roles and Membership Roster | ORGS | Should-have |
| ORGS-004 | Switch Active Organization Context | ORGS | Nice-to-have |
| BORROWING-001 | Create Borrowing and Lending Records | BORROWING | Must-have |
| BORROWING-002 | Record Repayments and Status Progression | BORROWING | Must-have |
| BORROWING-003 | Maintain Payment History and Remaining Balance | BORROWING | Must-have |
| BORROWING-004 | Track Overdue Items and Settlement Notes | BORROWING | Should-have |
| MARKETPLACE-001 | Create and Edit Product Listings | MARKETPLACE | Must-have |
| MARKETPLACE-002 | Enforce Product Visibility Rules | MARKETPLACE | Must-have |
| MARKETPLACE-003 | Browse and Search Public Marketplace Listings | MARKETPLACE | Must-have |
| MARKETPLACE-004 | Show Profile Listings by Relationship | MARKETPLACE | Must-have |
| MARKETPLACE-005 | Manage Listing Lifecycle | MARKETPLACE | Should-have |
| MARKETPLACE-006 | Curate Personalized Suggestion Feed Layout | MARKETPLACE | Nice-to-have |
| TRANSACTIONS-001 | Record User-to-User Transactions | TRANSACTIONS | Must-have |
| TRANSACTIONS-002 | Attach Optional Invoice Image | TRANSACTIONS | Must-have |
| TRANSACTIONS-003 | Track Revenue, Expenses, Profit, and Customers | TRANSACTIONS | Must-have |
| TRANSACTIONS-004 | Adjust Posted Transactions with Audit Trail | TRANSACTIONS | Should-have |
| REPORTING-001 | Unified Performance Dashboard | REPORTING | Must-have |
| REPORTING-002 | Save Report Views and Export Summaries | REPORTING | Nice-to-have |

### User Story Index

| Story ID | Title | Module | Pages | Priority |
| -------- | ----- | ------ | ----- | -------- |
| US-001 | Register a new account | IDENTITY | RegisterPage | Must-have |
| US-002 | Sign in to my account | IDENTITY | LoginPage | Must-have |
| US-003 | Recover my account | IDENTITY | AccountRecoveryPage | Must-have |
| US-004 | Edit my profile storefront | IDENTITY | ProfileSettingsPage | Should-have |
| US-005 | Send a connection request | CONNECTIONS | UserProfilePage | Must-have |
| US-006 | Accept or reject a connection request | CONNECTIONS | ConnectionRequestsPage | Must-have |
| US-007 | Remove an existing connection | CONNECTIONS | ConnectionsPage | Must-have |
| US-008 | Create an organization | ORGS | OrganizationsPage | Must-have |
| US-009 | Invite a user to my organization | ORGS | OrganizationDetailPage | Must-have |
| US-010 | Approve a join request | ORGS | OrganizationDetailPage | Must-have |
| US-011 | Update member role or remove a member | ORGS | OrganizationDetailPage | Should-have |
| US-012 | Create a product listing with privacy selection | MARKETPLACE | ProductEditorPage | Must-have |
| US-013 | Browse and search global marketplace products | MARKETPLACE | MarketplacePage, SearchResultsPage | Must-have |
| US-014 | View another seller profile with privacy-based access | MARKETPLACE | UserProfilePage | Must-have |
| US-015 | View recommendation and suggestion feed | MARKETPLACE | SuggestionsFeedPage | Must-have |
| US-016 | Record a transaction and attach an invoice image | TRANSACTIONS | TransactionCreatePage, TransactionDetailPage | Must-have |
| US-017 | Monitor customer and profit performance | TRANSACTIONS | CommerceDashboardPage | Must-have |
| US-018 | Create a borrowing or lending record | BORROWING | BorrowingCreatePage | Must-have |
| US-019 | Record repayment and check remaining balance | BORROWING | BorrowingDetailPage | Must-have |
| US-020 | Review sales and borrowing dashboards | REPORTING | CommerceDashboardPage, BorrowingDashboardPage, ReportsPage | Must-have |

---

## 1. Overview

SariSariNet is a multi-vendor marketplace where every registered user can buy and sell products. The platform combines product discovery with strict visibility control using product privacy, user connections, and organization membership. It also tracks commercial and borrowing activity, including invoice evidence and repayment audit records, so users can monitor financial performance and obligations in one place.

## 2. Objectives

- Enable every registered user to publish product listings and transact with other users from day one.
- Enforce visibility rules so private products are accessible only to connected users and/or same-organization users.
- Provide complete transaction tracking for expenses, revenue, profit, customers, and optional invoice image evidence.
- Support borrowing and lending of money or items with due dates, repayment status progression, and payment history.
- Deliver dashboards that summarize commerce and borrowing outcomes with data freshness under 5 minutes.

## 3. User Roles

| Role | Description | Key Permissions |
| ---- | ----------- | --------------- |
| Visitor | Unauthenticated person browsing the platform | View public marketplace items only |
| Registered User | Authenticated user acting as both buyer and seller | Create product listings, transact, connect with users, borrow/lend |
| Organization Admin | Registered user with organization administration authority | Invite/approve/remove members, assign member roles |
| Organization Member | Registered user belonging to at least one organization | View org-allowed private listings, transact with members |

## 4. User Stories

#### US-001 - Register a new account

**As a** visitor,
**I want to** register with required account details,
**So that** I can buy and sell on the platform.

**Module:** IDENTITY
**Pages:** RegisterPage
**Priority:** Must-have

#### US-002 - Sign in to my account

**As a** registered user,
**I want to** sign in with valid credentials,
**So that** I can access my storefront and dashboards.

**Module:** IDENTITY
**Pages:** LoginPage
**Priority:** Must-have

#### US-003 - Recover my account

**As a** registered user,
**I want to** recover access when I cannot sign in,
**So that** I can resume buying and selling.

**Module:** IDENTITY
**Pages:** AccountRecoveryPage
**Priority:** Must-have

#### US-004 - Edit my profile storefront

**As a** registered user,
**I want to** update my profile and storefront details,
**So that** buyers and other sellers can identify me.

**Module:** IDENTITY
**Pages:** ProfileSettingsPage
**Priority:** Should-have

#### US-005 - Send a connection request

**As a** registered user,
**I want to** send a connection request to another user,
**So that** we can view each other's private listings when connected.

**Module:** CONNECTIONS
**Pages:** UserProfilePage
**Priority:** Must-have

#### US-006 - Accept or reject a connection request

**As a** registered user,
**I want to** accept or reject incoming connection requests,
**So that** I can control who can access my private listings.

**Module:** CONNECTIONS
**Pages:** ConnectionRequestsPage
**Priority:** Must-have
#### US-007 - Remove an existing connection

**As a** registered user,
**I want to** remove a connection,
**So that** private-listing access is revoked when needed.

**Module:** CONNECTIONS
**Pages:** ConnectionsPage
**Priority:** Must-have

#### US-008 - Create an organization

**As a** registered user,
**I want to** create an organization,
**So that** I can collaborate and share private listings with members.

**Module:** ORGS
**Pages:** OrganizationsPage
**Priority:** Must-have

#### US-009 - Invite a user to my organization

**As a** organization admin,
**I want to** invite users to join,
**So that** they can access organization-scoped private listings.

**Module:** ORGS
**Pages:** OrganizationDetailPage
**Priority:** Must-have

#### US-010 - Approve a join request

**As a** organization admin,
**I want to** approve or reject join requests,
**So that** only allowed users become members.

**Module:** ORGS
**Pages:** OrganizationDetailPage
**Priority:** Must-have

#### US-011 - Update member role or remove a member

**As a** organization admin,
**I want to** manage member roles and removals,
**So that** organization access stays accurate.

**Module:** ORGS
**Pages:** OrganizationDetailPage
**Priority:** Should-have

#### US-012 - Create a product listing with privacy selection

**As a** registered user,
**I want to** create a product and set it as public or private,
**So that** I can control who can discover it.

**Module:** MARKETPLACE
**Pages:** ProductEditorPage
**Priority:** Must-have

#### US-013 - Browse and search global marketplace products

**As a** visitor,
**I want to** browse and search public listings,
**So that** I can discover products to buy.

**Module:** MARKETPLACE
**Pages:** MarketplacePage, SearchResultsPage
**Priority:** Must-have

#### US-014 - View another seller profile with privacy-based access

**As a** registered user,
**I want to** view a seller profile and listings based on our relationship,
**So that** I can see private products only when I am eligible.

**Module:** MARKETPLACE
**Pages:** UserProfilePage
**Priority:** Must-have

#### US-015 - View recommendation and suggestion feed

**As a** registered user,
**I want to** receive product suggestions,
**So that** I can discover relevant public products faster.

**Module:** MARKETPLACE
**Pages:** SuggestionsFeedPage
**Priority:** Must-have

#### US-016 - Record a transaction and attach an invoice image

**As a** registered user,
**I want to** log a sale or purchase and optionally attach an invoice image,
**So that** my records are verifiable and complete.

**Module:** TRANSACTIONS
**Pages:** TransactionCreatePage, TransactionDetailPage
**Priority:** Must-have

#### US-017 - Monitor customer and profit performance

**As a** registered user,
**I want to** view revenue, expense, profit, and customer metrics,
**So that** I can evaluate business performance.

**Module:** TRANSACTIONS
**Pages:** CommerceDashboardPage
**Priority:** Must-have

#### US-018 - Create a borrowing or lending record

**As a** registered user,
**I want to** record borrowed or lent money/items with terms,
**So that** obligations are tracked with clear due dates.

**Module:** BORROWING
**Pages:** BorrowingCreatePage
**Priority:** Must-have

#### US-019 - Record repayment and check remaining balance

**As a** registered user,
**I want to** log repayments and view status changes,
**So that** I know what is unpaid, partially paid, or settled.

**Module:** BORROWING
**Pages:** BorrowingDetailPage
**Priority:** Must-have

#### US-020 - Review sales and borrowing dashboards

**As a** registered user,
**I want to** review dashboard summaries,
**So that** I can monitor sales, expenses, profit, invoices, and borrowing/lending activity.

**Module:** REPORTING
**Pages:** CommerceDashboardPage, BorrowingDashboardPage, ReportsPage
**Priority:** Must-have

### Page Manifest (derived from User Stories)

| Page | Stories | Route |
| ---- | ------- | ----- |
| RegisterPage | US-001 | /register |
| LoginPage | US-002 | /login |
| AccountRecoveryPage | US-003 | /account/recovery |
| ProfileSettingsPage | US-004 | /settings/profile |
| UserProfilePage | US-005, US-014 | /users/:userId |
| ConnectionRequestsPage | US-006 | /connections/requests |
| ConnectionsPage | US-007 | /connections |
| OrganizationsPage | US-008 | /organizations |
| OrganizationDetailPage | US-009, US-010, US-011 | /organizations/:orgId |
| ProductEditorPage | US-012 | /products/new |
| MarketplacePage | US-013 | /marketplace |
| SearchResultsPage | US-013 | /search |
| SuggestionsFeedPage | US-015 | /suggestions |
| TransactionCreatePage | US-016 | /transactions/new |
| TransactionDetailPage | US-016 | /transactions/:transactionId |
| CommerceDashboardPage | US-017, US-020 | /dashboard/commerce |
| BorrowingCreatePage | US-018 | /borrowing/new |
| BorrowingDetailPage | US-019 | /borrowing/:recordId |
| BorrowingDashboardPage | US-020 | /dashboard/borrowing |
| ReportsPage | US-020 | /reports |

## 5. Modules

### 5.1 IDENTITY - Identity and Access

#### Requirements

##### IDENTITY-001 - Register and Sign In

**Description:**
A visitor can register and then sign in as a registered user to access buying, selling, and finance features.

**Acceptance Criteria:**

- GIVEN a visitor, WHEN valid registration details are submitted, THEN a new user account is created and can sign in.
- GIVEN a registered user, WHEN valid credentials are submitted, THEN access to authenticated pages is granted.

**Error States:**

- WHEN registration data fails validation, THEN block account creation and show field-specific errors -> `IDENTITY_INVALID_INPUT`
- WHEN sign-in credentials are incorrect, THEN deny access and show an authentication error -> `IDENTITY_AUTH_FAILED`

**Priority:** Must-have

##### IDENTITY-002 - Manage Profile and Storefront Details

**Description:**
A registered user can update profile details shown on their user profile and storefront identity.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN profile changes are saved with valid values, THEN updated details appear on their profile page.
- GIVEN a registered user, WHEN profile fields exceed validation rules, THEN changes are rejected with clear validation messages.

**Error States:**

- WHEN a profile update violates field constraints, THEN keep existing profile data and show errors -> `IDENTITY_PROFILE_INVALID`
- WHEN profile save cannot be completed, THEN show retry guidance and keep draft data on screen -> `IDENTITY_PROFILE_SAVE_FAILED`

**Priority:** Should-have

##### IDENTITY-003 - Recover Account Access

**Description:**
A registered user can recover access when they cannot sign in, without contacting support staff.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN a valid recovery request is submitted, THEN a recovery flow is started for that account.
- GIVEN a registered user in recovery flow, WHEN recovery is completed, THEN they can sign in with updated credentials.

**Error States:**

- WHEN a recovery request is invalid or expired, THEN block recovery completion and show an expiration message -> `IDENTITY_RECOVERY_EXPIRED`
- WHEN too many recovery attempts are made, THEN temporarily block new recovery requests -> `IDENTITY_RECOVERY_RATE_LIMITED`

**Priority:** Must-have
##### IDENTITY-004 - Deactivate Account

**Description:**
A registered user can deactivate their account to prevent new activity while preserving historical records.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN they confirm account deactivation, THEN new sign-ins are blocked for that account.
- GIVEN a deactivated account, WHEN related historical transactions are viewed by authorized parties, THEN records remain visible as historical entries.

**Error States:**

- WHEN deactivation confirmation is missing, THEN do not change account status -> `IDENTITY_DEACTIVATION_NOT_CONFIRMED`
- WHEN deactivation cannot be completed, THEN keep account active and show failure guidance -> `IDENTITY_DEACTIVATION_FAILED`

**Priority:** Nice-to-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Missing or invalid session | Redirect to sign-in page |
| `FORBIDDEN` | User tries to access another account's settings | Show permission denied message |
| `RATE_LIMITED` | Excessive sign-in or recovery attempts | Show cooldown message with retry time |

---

### 5.2 CONNECTIONS - User Connections

#### Requirements

##### CONNECTIONS-001 - Manage Connection Requests and Removal

**Description:**
A registered user can send, accept, reject, and remove user connections.

**Acceptance Criteria:**

- GIVEN two registered users with no connection, WHEN one user sends a request and the other accepts, THEN both users are marked as connected.
- GIVEN two connected users, WHEN either user removes the connection, THEN private-listing access granted through that connection is revoked.

**Error States:**

- WHEN a duplicate request is sent while a request or connection already exists, THEN reject the action and show current relationship state -> `CONNECTIONS_DUPLICATE_REQUEST`
- WHEN a user responds to a request that is no longer pending, THEN reject the action and refresh request status -> `CONNECTIONS_REQUEST_NOT_PENDING`

**Priority:** Must-have

##### CONNECTIONS-002 - View Connection Network State

**Description:**
A registered user can view incoming requests, outgoing requests, and active connections in one place.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN they open the connections pages, THEN lists are grouped by incoming, outgoing, and active states.
- GIVEN a registered user with no records in a list, WHEN that list is opened, THEN an empty-state message is shown.

**Error States:**

- WHEN a relationship list cannot be retrieved, THEN show a load error with retry option -> `CONNECTIONS_LIST_LOAD_FAILED`
- WHEN pagination parameters are invalid, THEN reset to a valid page and notify the user -> `CONNECTIONS_INVALID_PAGE`

**Priority:** Should-have

##### CONNECTIONS-003 - Connection Activity Notifications

**Description:**
A registered user can receive notifications for new requests and accepted connections.

**Acceptance Criteria:**

- GIVEN a user receives a connection request, WHEN the event is created, THEN the recipient receives a visible notification entry.
- GIVEN a sent request is accepted, WHEN status changes to connected, THEN both users receive acceptance notification entries.

**Error States:**

- WHEN notification delivery fails, THEN keep the connection action result and mark notification as undelivered for retry -> `CONNECTIONS_NOTIFICATION_FAILED`
- WHEN notification preferences are disabled, THEN suppress non-critical alerts without blocking connection actions -> `CONNECTIONS_NOTIFICATION_SUPPRESSED`

**Priority:** Nice-to-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session missing or expired | Redirect to sign-in page |
| `CONNECTIONS_SELF_ACTION` | User attempts to connect with self | Show "You cannot connect with yourself" |
| `RATE_LIMITED` | Excessive connection actions in short interval | Show throttling message |

---

### 5.3 ORGS - Organization Management

#### Requirements

##### ORGS-001 - Create Organization

**Description:**
A registered user can create an organization and become its initial admin.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN a valid organization name is submitted, THEN a new organization is created and the creator is assigned admin privileges.
- GIVEN an organization admin, WHEN organization details are viewed, THEN the creator appears in the member roster as admin.

**Error States:**

- WHEN organization name violates validation rules, THEN block creation and show name validation errors -> `ORGS_NAME_INVALID`
- WHEN organization creation fails, THEN show failure message and do not create partial membership state -> `ORGS_CREATE_FAILED`

**Priority:** Must-have

##### ORGS-002 - Invite, Join, and Approve Members

**Description:**
Organization admins can invite users, users can request to join, and admins can approve or reject pending membership.

**Acceptance Criteria:**

- GIVEN an organization admin, WHEN an invitation is sent to a valid user, THEN an actionable invite is created for that user.
- GIVEN a pending invite or join request, WHEN an admin approves it, THEN the user becomes an active organization member.

**Error States:**

- WHEN a user is already a member or has an active invite/request, THEN reject duplicate membership actions -> `ORGS_MEMBERSHIP_ALREADY_EXISTS`
- WHEN a non-admin user attempts approval, THEN block the action and show permission error -> `ORGS_APPROVAL_FORBIDDEN`

**Priority:** Must-have
##### ORGS-003 - Manage Roles and Membership Roster

**Description:**
Organization admins can assign member roles, remove members, and filter membership roster records.

**Acceptance Criteria:**

- GIVEN an organization admin, WHEN a member role is updated, THEN role changes are reflected immediately in organization permissions.
- GIVEN an organization admin, WHEN a member is removed, THEN organization-scoped private listing access for that member is revoked.

**Error States:**

- WHEN role assignment is not allowed for target member type, THEN reject the change with guidance -> `ORGS_ROLE_INVALID`
- WHEN member removal targets the only remaining admin, THEN block removal and require another admin first -> `ORGS_LAST_ADMIN_PROTECTED`

**Priority:** Should-have

##### ORGS-004 - Switch Active Organization Context

**Description:**
A user who belongs to multiple organizations can switch active context to review org-scoped product visibility and membership actions.

**Acceptance Criteria:**

- GIVEN a user with memberships in multiple organizations, WHEN they switch active organization, THEN org-specific pages reflect the selected context.
- GIVEN a user with only one organization, WHEN they open context switch controls, THEN the single organization is shown as fixed context.

**Error States:**

- WHEN a user selects an organization they do not belong to, THEN reject selection and restore prior context -> `ORGS_CONTEXT_FORBIDDEN`
- WHEN context switch load fails, THEN keep previous context active and show retry message -> `ORGS_CONTEXT_SWITCH_FAILED`

**Priority:** Nice-to-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session missing or expired | Redirect to sign-in page |
| `FORBIDDEN` | User lacks organization admin privileges | Show permission denied message |
| `ORGS_NOT_FOUND` | Organization does not exist or inaccessible | Show not found message and return to organizations list |

---

### 5.4 BORROWING - Borrowing and Lending

#### Requirements

##### BORROWING-001 - Create Borrowing and Lending Records

**Description:**
A registered user can create records for money or item borrowing/lending with counterparties, due dates, and terms.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN a borrowing/lending record with valid required fields is submitted, THEN the record is created with status set to Unpaid.
- GIVEN a borrowing record for items, WHEN quantity and item description are provided, THEN the record includes item details and due terms.

**Error States:**

- WHEN required fields are missing, THEN block record creation and show field-level validation errors -> `BORROWING_INVALID_INPUT`
- WHEN counterparty selection is invalid, THEN block creation and show invalid counterparty message -> `BORROWING_COUNTERPARTY_INVALID`

**Priority:** Must-have

##### BORROWING-002 - Record Repayments and Status Progression

**Description:**
Users can record repayment events that update status to Unpaid, Partially Paid, Paid, or Paid Late.

**Acceptance Criteria:**

- GIVEN an unpaid borrowing record, WHEN a partial repayment is posted, THEN status becomes Partially Paid and remaining balance decreases.
- GIVEN a borrowing record fully settled after due date, WHEN final repayment is posted, THEN status becomes Paid Late.

**Error States:**

- WHEN repayment amount exceeds remaining balance beyond allowed tolerance, THEN reject repayment and show correction guidance -> `BORROWING_OVERPAYMENT_INVALID`
- WHEN repayment is posted to a closed record, THEN reject update and show current record status -> `BORROWING_RECORD_CLOSED`

**Priority:** Must-have

##### BORROWING-003 - Maintain Payment History and Remaining Balance

**Description:**
Each borrowing/lending record provides a chronological payment history, remaining balance, and immutable audit entries.

**Acceptance Criteria:**

- GIVEN any repayment update, WHEN it is saved, THEN a payment-history entry is appended with amount, date, and actor.
- GIVEN a borrowing record with payment history, WHEN details are opened, THEN remaining balance is consistent with original obligation minus all valid repayments.

**Error States:**

- WHEN payment history retrieval fails, THEN show an error state and preserve record summary data -> `BORROWING_HISTORY_LOAD_FAILED`
- WHEN audit trail data is unavailable, THEN block destructive edits and show audit integrity warning -> `BORROWING_AUDIT_UNAVAILABLE`

**Priority:** Must-have

##### BORROWING-004 - Track Overdue Items and Settlement Notes

**Description:**
Users can mark settlement notes and see overdue indicators for records past due date without full settlement.

**Acceptance Criteria:**

- GIVEN a borrowing record past due date with remaining balance, WHEN the record is viewed, THEN it is marked overdue.
- GIVEN an overdue record, WHEN a user saves a settlement note, THEN the note is stored and shown in record history.

**Error States:**

- WHEN settlement note exceeds length or content rules, THEN reject save and show note validation errors -> `BORROWING_NOTE_INVALID`
- WHEN overdue indicator cannot be calculated, THEN show status as unknown and prompt data refresh -> `BORROWING_OVERDUE_CALC_FAILED`

**Priority:** Should-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session missing or expired | Redirect to sign-in page |
| `BORROWING_NOT_FOUND` | Borrowing record does not exist or is inaccessible | Show not found message |
| `RATE_LIMITED` | Excessive repayment submissions | Show throttling and retry guidance |

---

### 5.5 MARKETPLACE - Product Catalog and Discovery

#### Requirements

##### MARKETPLACE-001 - Create and Edit Product Listings

**Description:**
A registered user can create and edit product listings with required product details and a visibility mode of Public or Private.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN valid product data is saved with visibility set to Public, THEN the listing is published as public.
- GIVEN a registered user, WHEN valid product data is saved with visibility set to Private, THEN the listing is published as private.

**Error States:**

- WHEN required product details are missing, THEN block save and show field-level validation errors -> `MARKETPLACE_PRODUCT_INVALID`
- WHEN visibility value is unsupported, THEN reject save and show allowed visibility options -> `MARKETPLACE_VISIBILITY_INVALID`

**Priority:** Must-have

##### MARKETPLACE-002 - Enforce Product Visibility Rules

**Description:**
The system enforces that private products are visible only to connected users and/or users in at least one shared organization with the seller.

**Acceptance Criteria:**

- GIVEN a private listing, WHEN a connected user or same-organization user views eligible pages, THEN the listing is visible.
- GIVEN a private listing, WHEN an unconnected and non-shared-organization user views eligible pages, THEN the listing is hidden.

**Error States:**

- WHEN relationship state cannot be determined, THEN default to hiding private listings and show a temporary visibility error message -> `MARKETPLACE_ACCESS_STATE_UNKNOWN`
- WHEN user tries direct access to a private listing without permission, THEN deny access and show restricted-content message -> `MARKETPLACE_PRIVATE_FORBIDDEN`

**Priority:** Must-have

##### MARKETPLACE-003 - Browse and Search Public Marketplace Listings

**Description:**
Public listings appear in global marketplace browsing and search results, while private listings are excluded from those channels.

**Acceptance Criteria:**

- GIVEN global marketplace view, WHEN listings load, THEN only public listings are returned.
- GIVEN a search query, WHEN search results are shown, THEN private listings are excluded from results unless user is viewing the seller profile where access is explicitly allowed.

**Error States:**

- WHEN marketplace results cannot load, THEN show error state with retry control -> `MARKETPLACE_LIST_LOAD_FAILED`
- WHEN search query is invalid, THEN reject query and show validation message -> `MARKETPLACE_SEARCH_INVALID`

**Priority:** Must-have
##### MARKETPLACE-004 - Show Profile Listings by Relationship

**Description:**
A seller profile page displays public listings to everyone and private listings only to connected users and/or same-organization users.

**Acceptance Criteria:**

- GIVEN any viewer on a seller profile, WHEN listings render, THEN all public listings are shown.
- GIVEN a viewer who is connected or in the same organization as seller, WHEN listings render, THEN eligible private listings are also shown.

**Error States:**

- WHEN profile listing visibility checks fail, THEN render public listings only and show limited-results message -> `MARKETPLACE_PROFILE_VISIBILITY_PARTIAL`
- WHEN seller profile is unavailable, THEN show profile not found state -> `MARKETPLACE_PROFILE_NOT_FOUND`

**Priority:** Must-have

##### MARKETPLACE-005 - Manage Listing Lifecycle

**Description:**
Sellers can archive, unarchive, and update inventory state of listings without deleting historical transaction references.

**Acceptance Criteria:**

- GIVEN a seller listing, WHEN the seller archives it, THEN listing is removed from active browsing channels.
- GIVEN an archived listing with historical transactions, WHEN it is archived, THEN related transaction history remains intact.

**Error States:**

- WHEN user without ownership tries lifecycle update, THEN block action and show permission error -> `MARKETPLACE_LISTING_FORBIDDEN`
- WHEN lifecycle update conflicts with current listing state, THEN reject action and refresh listing status -> `MARKETPLACE_STATE_CONFLICT`

**Priority:** Should-have

##### MARKETPLACE-006 - Curate Personalized Suggestion Feed Layout

**Description:**
Users can choose suggestion-feed layout preferences while feed content remains limited to public products.

**Acceptance Criteria:**

- GIVEN a user with saved layout preference, WHEN suggestions page loads, THEN preferred layout is applied.
- GIVEN a user without preference, WHEN suggestions page loads, THEN a default layout is shown.

**Error States:**

- WHEN preference save fails, THEN keep previous layout and show save failure message -> `MARKETPLACE_PREF_SAVE_FAILED`
- WHEN suggestion feed cannot load, THEN show empty-state error and retry control -> `MARKETPLACE_SUGGESTIONS_LOAD_FAILED`

**Priority:** Nice-to-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session required for protected listing actions | Redirect to sign-in page |
| `FORBIDDEN` | User lacks permission for listing action | Show permission denied message |
| `MARKETPLACE_NOT_FOUND` | Listing or seller profile not found | Show not found state |

---

### 5.6 TRANSACTIONS - Sales and Financial Records

#### Requirements

##### TRANSACTIONS-001 - Record User-to-User Transactions

**Description:**
A registered user can record sale or purchase transactions linked to a buyer, seller, product context, and monetary amount.

**Acceptance Criteria:**

- GIVEN a registered user, WHEN a valid transaction is submitted, THEN the transaction is saved with buyer, seller, amount, and date.
- GIVEN a saved transaction, WHEN either participant views transaction details, THEN transaction fields are displayed consistently.

**Error States:**

- WHEN transaction amount is invalid, THEN reject save and show amount validation errors -> `TRANSACTIONS_AMOUNT_INVALID`
- WHEN required participant fields are missing, THEN reject save and highlight missing fields -> `TRANSACTIONS_PARTICIPANT_REQUIRED`

**Priority:** Must-have

##### TRANSACTIONS-002 - Attach Optional Invoice Image

**Description:**
A user can attach an optional invoice image to a transaction for verification and record keeping.

**Acceptance Criteria:**

- GIVEN a transaction form, WHEN user submits a valid transaction without an invoice image, THEN transaction is saved successfully.
- GIVEN a transaction form, WHEN user uploads a valid invoice image and submits, THEN transaction is saved with invoice image reference viewable in details.

**Error States:**

- WHEN uploaded file type or size violates rules, THEN reject upload and show file validation message -> `TRANSACTIONS_INVOICE_FILE_INVALID`
- WHEN invoice upload fails during transaction save, THEN preserve transaction draft and show retry instructions -> `TRANSACTIONS_INVOICE_UPLOAD_FAILED`

**Priority:** Must-have
##### TRANSACTIONS-003 - Track Revenue, Expenses, Profit, and Customers

**Description:**
The system calculates and updates user-level revenue, expense, profit, and customer metrics from recorded transactions.

**Acceptance Criteria:**

- GIVEN posted transactions for a user, WHEN dashboard metrics are refreshed, THEN revenue, expenses, and profit totals match transaction sums for the selected period.
- GIVEN transactions linked to counterparties, WHEN customer metrics are refreshed, THEN unique customer counts and totals are shown accurately.

**Error States:**

- WHEN metric recalculation fails, THEN preserve prior computed snapshot and show delayed-update warning -> `TRANSACTIONS_METRICS_RECALC_FAILED`
- WHEN period filters are invalid, THEN reject filter and restore default period -> `TRANSACTIONS_PERIOD_INVALID`

**Priority:** Must-have

##### TRANSACTIONS-004 - Adjust Posted Transactions with Audit Trail

**Description:**
Authorized users can void or correct posted transactions while preserving original values in an audit trail.

**Acceptance Criteria:**

- GIVEN an authorized user, WHEN a transaction correction is submitted, THEN updated values are saved and prior values are retained in audit history.
- GIVEN a voided transaction, WHEN reports are recalculated, THEN the voided amount is excluded from active totals and traceable in audit history.

**Error States:**

- WHEN unauthorized user attempts correction or void, THEN block action and show permission error -> `TRANSACTIONS_ADJUST_FORBIDDEN`
- WHEN adjustment reason is missing, THEN reject adjustment and request reason input -> `TRANSACTIONS_ADJUST_REASON_REQUIRED`

**Priority:** Should-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session missing or expired | Redirect to sign-in page |
| `TRANSACTION_NOT_FOUND` | Transaction does not exist or inaccessible | Show not found message |
| `RATE_LIMITED` | Excessive transaction creation attempts | Show throttling message and retry guidance |

---

### 5.7 REPORTING - Dashboards and Reports

#### Requirements

##### REPORTING-001 - Unified Performance Dashboard

**Description:**
A registered user can view dashboard summaries for sales performance, expenses, profit, customers, invoices, and borrowing/lending activity.

**Acceptance Criteria:**

- GIVEN a registered user with activity data, WHEN dashboard pages load, THEN commerce and borrowing KPIs are displayed for the selected date range.
- GIVEN dashboard totals, WHEN user navigates to related detail pages, THEN linked records correspond to the shown summary values.

**Error States:**

- WHEN dashboard aggregation fails, THEN show partial data warning and identify unavailable widgets -> `REPORTING_DASHBOARD_PARTIAL`
- WHEN dashboard filters are invalid, THEN reject filter input and revert to default date range -> `REPORTING_FILTER_INVALID`

**Priority:** Must-have

##### REPORTING-002 - Save Report Views and Export Summaries

**Description:**
Users can save report filter presets and export summary snapshots for sharing outside the platform.

**Acceptance Criteria:**

- GIVEN a configured report view, WHEN user saves preset, THEN preset appears in saved report views.
- GIVEN a valid report range, WHEN user requests export, THEN a summary export is generated from currently visible data.

**Error States:**

- WHEN preset name is invalid or duplicate, THEN block save and show validation message -> `REPORTING_PRESET_INVALID`
- WHEN export generation fails, THEN show export failure message and keep report view active -> `REPORTING_EXPORT_FAILED`

**Priority:** Nice-to-have

#### Error States

| Error Code | Condition | User-Facing Behavior |
| ---------- | --------- | -------------------- |
| `UNAUTHORIZED` | Session missing or expired | Redirect to sign-in page |
| `REPORTING_DATA_UNAVAILABLE` | Upstream metrics data not yet ready | Show temporary unavailability message |
| `FORBIDDEN` | User attempts to access another user's reports | Show permission denied message |

## 6. Non-Functional Requirements

- **Performance:** Marketplace browse and search responses should complete in under 2 seconds at p95 for up to 10,000 active listings.
- **Performance:** Dashboard and report API responses should complete in under 3 seconds at p95 for date ranges up to 12 months.
- **Data Freshness:** Financial and borrowing dashboards should reflect posted transactions and repayments within 5 minutes.
- **Security:** All private listing, transaction, borrowing, and organization actions require authenticated sessions and authorization checks.
- **Auditability:** All transaction adjustments and borrowing repayment updates must generate immutable audit entries with actor and timestamp.
- **File Handling:** Invoice image uploads must enforce allowed types, maximum size, and malware scanning before attachment is accepted.
- **Availability:** Core MVP workflows (listing, transaction logging, borrowing updates, dashboard viewing) should maintain 99.5% monthly uptime.

## 7. Assumptions and Constraints

- All buying, selling, borrowing, and organization actions require a registered user account.
- Every transaction is recorded within the platform and is the source for revenue, expense, profit, and customer metrics.
- Invoice image attachment is optional per transaction, but if attached, it must pass platform file validation rules.
- A private product is visible when at least one allowed relationship is true: active user connection or shared organization membership.
- Borrowing statuses are strictly limited to Unpaid, Partially Paid, Paid, and Paid Late.
- Organization role policy supports at minimum one admin per organization at all times.
- MVP excludes complex legal contract generation and external credit or identity verification integrations.

## 8. Out of Scope

Post-MVP items (names only):

- Built-in messaging or chat between users
- Automated debt collection workflows
- Advanced recommendation personalization using behavioral learning
- Multi-currency conversion and settlement
- Tax filing automation and statutory form generation

