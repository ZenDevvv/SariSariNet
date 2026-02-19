Create a pull request from the current branch to the target branch specified in $ARGUMENTS.

## Steps

### 1. Validate inputs

If $ARGUMENTS is empty, ask the user: "Which branch do you want to merge into? (e.g., main, develop)"

Set TARGET_BRANCH = $ARGUMENTS (trim any whitespace).

### 2. Get current state

Run the following commands to gather context:

- `git branch --show-current` — get CURRENT_BRANCH
- `git log origin/$TARGET_BRANCH..HEAD --oneline` — list commits not yet in target
- `git diff origin/$TARGET_BRANCH...HEAD --stat` — get changed files summary
- `git diff origin/$TARGET_BRANCH...HEAD` — get full diff for content analysis

If the current branch IS the target branch, stop and tell the user: "You are already on '$TARGET_BRANCH'. Switch to a feature branch before creating a PR."

If there are no commits ahead of the target branch, stop and tell the user: "No commits found ahead of '$TARGET_BRANCH'. Nothing to merge."

### 3. Check for existing PR

Run: `gh pr list --head $(git branch --show-current) --base $TARGET_BRANCH --state open`

If a PR already exists, show the user the existing PR URL and ask if they want to update the description or stop.

### 4. Analyze changes and generate PR content

From the commit messages, changed files, and diff content, synthesize:

**Title** — A concise, imperative-mood summary of the overall change (max 70 characters). Do NOT just repeat the branch name. Examples:
- "Add user authentication with JWT"
- "Fix cart total calculation on discount codes"
- "Refactor product catalog to use repository pattern"

**Summary** — 2–4 bullet points describing *what* changed and *why*, written for a reviewer who hasn't seen the branch. Focus on intent, not file names.

**Test plan** — A short checklist of things a reviewer should verify manually or via automated tests. Be specific to the actual changes.

**Type label** — Infer one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`

### 5. Check if remote branch exists, push if needed

Run: `git ls-remote --heads origin $(git branch --show-current)`

If the branch is not on the remote yet, run: `git push -u origin $(git branch --show-current)`

If the push fails, report the error and stop — do not force push.

### 6. Create the PR

Run:

```
gh pr create \
  --base $TARGET_BRANCH \
  --title "<generated title>" \
  --body "$(cat <<'EOF'
## Summary
<bullets>

## Test plan
<checklist>

## Type
`<type>`

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### 7. Output result

Print the PR URL returned by `gh pr create`.

Show the user the final title and summary so they can review what was generated.

If the PR creation fails (e.g. no `gh` CLI, missing permissions), show the exact error and suggest: "Run `gh auth login` if you haven't authenticated yet."
