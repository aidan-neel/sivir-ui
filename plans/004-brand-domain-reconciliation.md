# Plan 004: Reconcile the rebrand's external references (domain, repo name, README)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: Written against commit `41806b5` with a dirty
> working tree. Compare every "Current state" excerpt against the live code
> before editing; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (one MED item: the canonical-domain decision, gated by step 1)
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/108

## Why this matters

The silk→sivir rebrand is complete in source code (a repo-wide grep for `silk`
finds nothing in shipped code), but the **external references disagree with
each other**:

- The README advertises `sivir-ui.com`; the CLI's default registry and its
  error messages point at `sivir-ui.dev`. One of these is wrong — and whichever
  domain isn't real breaks `sivir add theme <slug>` for every CLI user
  (the default registry URL is baked into published `sivir.json` files).
- The README links `[Issues](ISSUES.md)` — the file does not exist (404 on
  GitHub's rendered README).
- Badges and the docs' star-count fetch still reference the pre-rename repo
  `aidan-neel/ui` (the repo is `aidan-neel/sivir-ui`; GitHub's redirect keeps
  it working today, which is why nothing looks broken).
- The devcontainer bootstrap `cd`s into a directory that doesn't exist, so the
  devcontainer setup fails for anyone who tries it.
- The root README has no development setup at all (badges + links only).

## Current state

- `README.md:16` — `[**Documentation**](https://sivir-ui.com/docs/introduction) · [**Components**](https://sivir-ui.com/docs/components/accordion) · [**Issues**](ISSUES.md) · [**License**](LICENSE)`
- `README.md:12-13` — badges: `https://github.com/aidan-neel/ui/milestone/2`
  and `https://img.shields.io/github/stars/aidan-neel/ui?...` +
  `https://github.com/aidan-neel/ui/stargazers`.
- `packages/sivir/cli/config.ts:11` — `registry: 'https://sivir-ui.dev/api'`
  (inside `DEFAULT_CONFIG`).
- `packages/sivir/cli/commands/theme.ts:27` — error message: `-- browse https://sivir-ui.dev/themes`.
- `apps/docs/src/routes/+layout.server.ts:5` — `const GITHUB_REPO = 'aidan-neel/ui';`
  (star-count fetch; works only via GitHub's rename redirect).
- `.devcontainer/post-create.sh:4` — `cd /workspaces/sivir/app` (no `app` dir
  exists anywhere; also check `.devcontainer/devcontainer.json` for the actual
  `workspaceFolder` before picking the correct path).
- Cosmetic occurrences of `sivir-ui.dev` in demo content:
  `apps/docs/src/routes/docs/components/label/examples/hero.svelte:8`,
  `apps/docs/src/routes/docs/components/dropdown-menu/examples/hero.svelte:19`,
  `apps/docs/src/lib/components/themes/studio/studio-preview.svelte:69`
  (placeholder text in demos — update only if trivially consistent, they carry
  no functional weight).
- The docs registry proxy reads `env.THEME_REGISTRY_URL` (default
  `http://localhost:4100`) in `apps/docs/src/lib/server/theme-registry.ts` —
  deployment config, not code; the CLI default must match the domain where
  the docs app (which exposes `/api/themes`) is actually deployed.
- Conventions: conventional commits (`docs: …`, `fix(cli): …`).

## Commands you will need

| Purpose      | Command                                                                   | Expected on success |
| ------------ | ------------------------------------------------------------------------- | ------------------- |
| Typecheck    | `bun run check` (root)                                                    | exit 0              |
| Docs test    | `bun --filter='docs' run test:ci`                                         | all pass            |
| CLI test     | `bun --filter='@sivir/ui' run test`                                       | all pass            |
| Format       | `bun run format:check` (root)                                             | exit 0              |
| Domain probe | `curl -sI https://sivir-ui.dev/api/themes \| head -1` and same for `.com` | see step 1          |

## Scope

**In scope**:

- `README.md`
- `packages/sivir/cli/config.ts`, `packages/sivir/cli/commands/theme.ts`
- `apps/docs/src/routes/+layout.server.ts` (the `GITHUB_REPO` constant only)
- `.devcontainer/post-create.sh`
- (optional, cosmetic) the three demo files listed above

**Out of scope**:

- `apps/docs/src/lib/server/theme-registry.ts` — env-driven, correct as is.
- Any DNS/deployment/domain purchase — report findings, don't act.
- The star-count fetch mechanics (caching, timeout) — only the repo constant.
- CI workflows, package.json files.

## Git workflow

- Branch: `advisor/004-brand-domain-reconciliation`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Determine the canonical domain (gate for steps 2–3)

Probe both candidates read-only:

```
curl -sI --max-time 10 https://sivir-ui.dev/api/themes | head -1
curl -sI --max-time 10 https://sivir-ui.com/api/themes | head -1
curl -sI --max-time 10 https://sivir-ui.dev | head -1
curl -sI --max-time 10 https://sivir-ui.com | head -1
```

- Exactly one domain serves the docs site (200/30x with content) → that's
  canonical; proceed.
- Both dead, both alive, or only a parking page → **STOP and report** the
  probe output; the maintainer must decide the canonical domain. (You may
  still complete steps 4–6, which don't depend on the domain.)

### Step 2: Point the CLI at the canonical domain

In `packages/sivir/cli/config.ts:11` and `theme.ts:27`, set the canonical
domain (keep the `/api` path suffix in `config.ts` — the docs app serves the
registry proxy at `/api/themes`).

**Verify**: `grep -rn "sivir-ui\." packages/sivir/cli/` → only canonical-domain
matches. `bun --filter='@sivir/ui' run test` → pass.

### Step 3: Fix README links and badges

- Links line: keep Documentation/Components on the canonical domain; replace
  `ISSUES.md` with `https://github.com/aidan-neel/sivir-ui/issues`.
- Badges: `aidan-neel/ui` → `aidan-neel/sivir-ui` in both the milestone link
  and the stars badge/stargazers link. Verify the milestone exists:
  `gh api repos/aidan-neel/sivir-ui/milestones --jq '.[].number'` — if `2` is
  absent, link to `/milestones` instead and note it.

**Verify**: `grep -c "aidan-neel/ui" README.md` → 0; `grep -c "ISSUES.md" README.md` → 0.

### Step 4: Fix the star-count repo constant

`apps/docs/src/routes/+layout.server.ts:5` → `const GITHUB_REPO = 'aidan-neel/sivir-ui';`

**Verify**: `bun --filter='docs' run test:ci` → pass.

### Step 5: Fix the devcontainer bootstrap

Read `.devcontainer/devcontainer.json`; set `post-create.sh` line 4 to `cd`
into the actual `workspaceFolder` value (no `/app` suffix — no such directory
exists in the repo).

**Verify**: `bash -n .devcontainer/post-create.sh` → exit 0, and the `cd`
target matches `workspaceFolder` exactly (eyeball both files side by side).

### Step 6: Give the root README a minimal development section

Add one short section (≤ 25 lines) after the header block: prerequisites
(Bun ≥ 1.3.11), `bun install`, `bun run dev`, `bun run check`, `bun run test`,
`bun run build`, and a 4-line monorepo map (`packages/sivir` = library + CLI,
`apps/docs` = docs site, `apps/registry` = themes API, `tools/token-lint`).
Match the existing README's tone — terse, no marketing.

**Verify**: `bun run format:check` → exit 0.

## Test plan

No new test files — this plan is reference fixes. Gates: the three existing
suites above plus the greps in each step.

## Done criteria

- [ ] `grep -rn "aidan-neel/ui[^-]" README.md apps/docs/src` → 0 matches
- [ ] `grep -c "ISSUES.md" README.md` → 0
- [ ] One consistent domain across `README.md` and `packages/sivir/cli/` (grep both, count mismatches = 0) — or a STOP report explaining why not
- [ ] `bash -n .devcontainer/post-create.sh` exits 0 and its `cd` path exists in `devcontainer.json`
- [ ] README contains a Development section with `bun install`
- [ ] `bun run check`, `bun --filter='docs' run test:ci`, `bun --filter='@sivir/ui' run test`, `bun run format:check` all exit 0
- [ ] `git status --porcelain` shows changes only in in-scope files
- [ ] `plans/README.md` status row updated

## STOP conditions

- Step 1's probe is ambiguous (neither or both domains live) — report, fix the
  domain-independent items (steps 4–6), leave 2–3 untouched.
- `.devcontainer/devcontainer.json` has no `workspaceFolder` and the default
  can't be inferred — report rather than guessing a path.
- Any excerpt/code mismatch.

## Maintenance notes

- The CLI default registry URL ships inside every user's generated
  `sivir.json` — after plan 001 publishes the package, changing the domain
  again means stale configs in the wild. Get the domain right before first
  publish; a reviewer should treat any future change to
  `DEFAULT_CONFIG.registry` as a breaking change.
- If the maintainer later adds a redirect from the non-canonical domain, the
  demo-content occurrences become fully cosmetic.
- Deferred: star-count fetch timeout/build-time embedding (audit finding
  PERF-06, downgraded) — worth folding into any future docs-performance pass.
