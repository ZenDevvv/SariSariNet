Read these context files before proceeding:
- `docs/progress.md` — full contents (required)
- `docs/brd.md` — project name, app description, and module list only (skip full requirement details)
- `docs/architecture.md` — tech stack and key decisions only (skip full model/route details)
- `docs/changes.md` — last 3 CHG entries only (if the file exists)

Then produce a structured session summary using the format below. Keep it concise — the goal is fast orientation, not a full report.

---

## Project: {name from BRD}

**Description:** {one sentence from BRD}
**Stack:** {from architecture.md}
**Modules:** {comma-separated list from BRD}

---

## Phase Progress

Group all rows from `docs/progress.md` into three sections:

### ✅ Complete
List phases that are done and not stale.

### ⚠️ Stale (Action Required)
List any rows with `⚠️ Stale` status. For each, show:
- Which phase and scope is stale
- What caused the staleness (from the Notes column)
- What to run to resolve it (e.g., `/phase5-backend-testing AUTH`)

If no stale rows exist, omit this section.

### Pending (Not Yet Run)
List phases that have not been run yet, in workflow order.

---

## Recent Changes

If `docs/changes.md` exists, list the last 3 CHG entries:
- CHG-NNN — {date} — {one-line summary}

If no changes exist, omit this section.

---

## Recommended Next Action

Based on the current state, tell the user exactly what to do next:

- **If there are stale items:** List the re-run commands in order (e.g., "Re-run `/phase5-backend-testing AUTH` — stale since phase 4b AUTH was updated")
- **If no stale items and phases are in progress:** Suggest the next incomplete phase in workflow order
- **If the backend track is done but design track is not:** Remind the user both can run in parallel
- **If both tracks are done:** Suggest starting the frontend track with `/phase8-frontend-api`
- **If everything looks complete:** Suggest `/phase12-review` or `/phase14-deployment`

Be specific — give the exact command to run next.
