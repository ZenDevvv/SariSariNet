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

### 3. Resolve the `gh` executable

Before running any `gh` command, determine the correct executable path:

1. Run `gh --version` — if it succeeds, set `GH=gh` and continue.
2. If that fails, run `where gh.exe` (Windows) — if it returns a path, set `GH` to that path.
3. If `where` fails, check common install locations in order:
   - `C:/Program Files/GitHub CLI/gh.exe`
   - `C:/Program Files (x86)/GitHub CLI/gh.exe`
   - `~/AppData/Local/GitHub CLI/gh.exe`
   - `~/.local/bin/gh.exe`
4. If a path from step 3 exists (test with `test -f "<path>"`), set `GH` to that path.
5. If none of the above work, stop and tell the user: "GitHub CLI (`gh`) not found. Install it from https://cli.github.com/ and run `gh auth login`."

Use `$GH` in place of `gh` for all subsequent commands in this skill.

### 4. Check for existing PR

Run: `$GH pr list --head $(git branch --show-current) --base $TARGET_BRANCH --state open`

If a PR already exists, show the user the existing PR URL and ask if they want to update the description or stop.

### 5. Analyze changes and generate PR content

From the commit messages, changed files, and diff content, synthesize:

**Title** — A concise, imperative-mood summary of the overall change (max 70 characters). Do NOT just repeat the branch name. Examples:
- "Add user authentication with JWT"
- "Fix cart total calculation on discount codes"
- "Refactor product catalog to use repository pattern"

**Summary** — 2–4 bullet points describing *what* changed and *why*, written for a reviewer who hasn't seen the branch. Focus on intent, not file names.

**Test plan** — A short checklist of things a reviewer should verify manually or via automated tests. Be specific to the actual changes.

**Type label** — Infer one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`

### 6. Check if remote branch exists, push if needed

Run: `git ls-remote --heads origin $(git branch --show-current)`

If the branch is not on the remote yet, run: `git push -u origin $(git branch --show-current)`

If the push fails, report the error and stop — do not force push.

### 7. Create the PR

Run:

```
$GH pr create \
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

### 8. Output result

Print the PR URL returned by `$GH pr create`.

Show the user the final title and summary so they can review what was generated.

If the PR creation fails (e.g. missing permissions), show the exact error and suggest: "Run `$GH auth login` if you haven't authenticated yet."
