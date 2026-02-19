# Testing Conventions (Backend)

## Scope and intent
- Write behavioral tests: assert request/response contracts, validation outcomes, auth behavior, and visible state changes.
- Map test cases to BRD acceptance criteria and BRD error states.
- Prefer stable outcomes over implementation-coupled assertions.

## File structure
- Test files live in `sarisarinet-api/tests`.
- Use one Phase-5 suite file per phase milestone (`phase5-backend.spec.ts`) or split by module when test size grows.
- Keep helper functions at the top of the suite for consistent request/response setup.

## Naming
- Describe blocks:
  - `Unit: Controller method contracts`
  - `Integration: Route map + auth outcomes via real HTTP`
  - `Zod schema validation boundaries`
- Test names should follow `WHEN ... THEN ...` behavior language implicitly, e.g.:
  - `PRODUCT routes enforce owner/eligible auth and system token boundaries`
  - `INVOICE attachment schema enforces mime-type and max-size limits`

## Assertions
- For error responses, assert:
  - HTTP status
  - `status: "error"`
  - expected error `message`
  - numeric `code`
  - `timestamp` present
- For success responses, assert:
  - HTTP status
  - `status: "success"`
  - expected data keys only (do not overfit exact object internals unless required by contract).

## Auth and authorization tests
- For `AUTH` routes: verify invalid payload rejection without requiring authentication.
- For protected routes: verify missing auth yields `401`.
- For scheduler/system routes: verify missing `x-system-token` yields `403`.

## Validation tests
- Zod tests must include:
  - one valid payload
  - one missing required field case
  - one boundary/type violation case
- Use realistic object-id literals for id-bound schemas.

## Coverage rules for Phase 5
- Every Phase-4 module must be included:
  - `auth`, `profile`, `product`, `expense`, `borrowing`, `sales`, `invoice`, `report`
- Minimum required per module:
  - unit-level contract checks for controller methods
  - route-level HTTP checks for endpoint/auth behavior
  - zod-boundary checks for at least one core schema

## Anti-patterns
- Do not assert on internal calls (e.g., spying on Prisma method invocation arguments) when behavior can be asserted from output.
- Do not create order-dependent tests.
- Do not reuse mutable cross-test state.
