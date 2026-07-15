# Plan 005: Dependency security updates and manifest hygiene

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: Written against commit `41806b5` with a dirty
> working tree. Re-run `bun audit` first — advisory sets move; the exact
> versions below reflect 2026-07-06. Compare "Current state" excerpts before
> editing; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S–M
- **Risk**: MED (dep bumps can break the browser-test toolchain; every step is
  gated on the full suite)
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/109

## Why this matters

`bun audit` reports 17 advisories (1 critical, 5 high) — all in **dev/test
tooling or unreachable transitive paths**, none in the published library or
the registry's runtime server (Elysia itself is clean except a low-severity
`cookie` advisory). The one critical is real for CI: `@vitest/browser ≤ 4.1.7`
RCE (GHSA-g8mr-85jm-7xhm) in the browser-test infrastructure this repo runs on
every PR. Separately, the registry's manifest undermines reproducibility and
correctness: `elysia: "latest"` and `bun-types: "latest"` float (a breaking
Elysia release changes the API server on any fresh install), build-time tools
(`prisma`, `prettier`, `@types/pg`) sit in runtime `dependencies`, the
`"module": "src/index.js"` field points at a file that doesn't exist, and
`apps/docs` declares `fuse.js` which nothing in the app imports.

## Current state

- `bun audit` (root, 2026-07-06): critical `@vitest/browser >=4.0.0 <=4.1.7`
  (RCE, GHSA-g8mr-85jm-7xhm); high `vite >=8.0.0 <=8.0.15`
  (GHSA-fx2h-pf6j-xcff, Windows-only dev server); high×3 `undici >=7.23.0
<7.28.0` via `workspace:docs › jsdom`; high `hono <4.12.25` +
  moderate `@hono/node-server <1.19.13` — **via `workspace:registry › prisma`
  only** (the `@prisma/dev` toolchain; not reachable from the deployed Elysia
  server); low `cookie <0.7.0` via `@sveltejs/kit` and `elysia`.
- `apps/registry/package.json` (excerpt):

  ```json
  "dependencies": {
  	"@elysiajs/openapi": "^1.4.14",
  	"@prisma/adapter-pg": "^7.6.0",
  	"@prisma/client": "^7.6.0",
  	"@types/pg": "^8.20.0",
  	"dotenv": "^17.4.0",
  	"elysia": "latest",
  	"pg": "^8.20.0",
  	"prettier": "^3.8.1",
  	"prisma": "^7.6.0",
  	"zod": "^4.3.6"
  },
  "devDependencies": { "bun-types": "latest", "typescript": "^5.9.3" },
  "module": "src/index.js"
  ```

- `packages/sivir/package.json` devDependencies include `"bun-types": "latest"`.
- `apps/docs/package.json` dependencies include `"fuse.js": "^7.1.0"` —
  `grep -rn "fuse" apps/docs/src` → zero matches (the command palette uses the
  library's own Command component; fuse.js is a dependency of
  `packages/sivir`, not of the docs app).
- Runtime imports of the registry (for step 3's dep/devDep split):
  `src/lib/prisma.ts` imports `dotenv/config`, `pg`, `@prisma/adapter-pg`,
  and the generated client; the service imports `elysia` + `@elysiajs/openapi`.
  **Check `zod` before moving it**: `grep -rn "zod" apps/registry/src` — if
  unused, it may be removable, but removal is optional; report rather than
  agonize.
- CI: `.github/workflows/ci.yml` (unit/ssr + registry + build) and
  `browser-tests.yml` (Playwright Chromium; installs the Playwright version
  found under `node_modules/.bun/playwright@*`).
- Conventions: tabs; conventional commits (`chore(deps): …`, `fix(registry): …`).

## Commands you will need

| Purpose          | Command                                  | Expected on success                        |
| ---------------- | ---------------------------------------- | ------------------------------------------ |
| Audit            | `bun audit` (root)                       | see step gates                             |
| Install/lockfile | `bun install` (root; updates `bun.lock`) | exit 0                                     |
| Typecheck        | `bun run check` (root)                   | exit 0                                     |
| Docs tests       | `bun --filter='docs' run test:ci`        | 471 pass today                             |
| Registry tests   | `bun --filter='registry' run test`       | 11 pass today                              |
| Package tests    | `bun --filter='@sivir/ui' run test`      | pass                                       |
| Browser tests    | `bun --filter='docs' run test:browser`   | pass (needs Playwright Chromium; see STOP) |
| Build            | `bun run build`                          | exit 0                                     |

## Scope

**In scope**:

- `apps/registry/package.json`
- `apps/docs/package.json`
- `packages/sivir/package.json` (the `bun-types` pin only)
- `bun.lock` (regenerated by `bun install` / targeted `bun update` — expected)

**Out of scope**:

- Source code changes anywhere (a dep bump that _requires_ source changes is a
  STOP, not a license to refactor).
- `hono`/`@hono/node-server` — transitive under `prisma`'s dev toolchain;
  resolved only by Prisma releases. Record as accepted residual.
- Major-version migrations (e.g., a hypothetical Vite 9 or Vitest 5) — bumps
  in this plan stay within currently-declared major ranges.

## Git workflow

- Branch: `advisor/005-dependency-security-hygiene`
- One commit per step (`chore(deps): patch vitest browser RCE advisory`, …).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Patch the advisory-affected dev dependencies

From the repo root, bump within existing major ranges:

```
bun update @vitest/browser @vitest/browser-playwright vitest vite jsdom
```

(`vitest`/`@vitest/browser*` move together; `jsdom` pulls the fixed `undici`.)

**Verify**: `bun audit` no longer lists `@vitest/browser` (critical) nor
`vite`/`undici` highs. Then the full gate: `bun run check`,
`bun --filter='docs' run test:ci`, `bun --filter='registry' run test`,
`bun --filter='@sivir/ui' run test`, `bun run build` — all exit 0. If a
Playwright-capable environment is available, also
`bun --filter='docs' run test:browser`; if not, say so in the report
(browser-tests CI will gate it).

### Step 2: Pin the floating versions

- `apps/registry/package.json`: `"elysia": "latest"` → caret-pin to the
  version currently resolved in `bun.lock` (find it:
  `grep -A1 '"elysia@' bun.lock | head -2`), e.g. `"^1.4.x"`.
- Same file: `"bun-types": "latest"` → caret-pin to the resolved version.
- `packages/sivir/package.json`: `"bun-types": "latest"` → same pin.

**Verify**: `grep -rn '"latest"' apps/registry/package.json packages/sivir/package.json` → 0 matches; `bun install` → exit 0; registry tests pass.

### Step 3: Fix the registry manifest

In `apps/registry/package.json`:

1. Delete the `"module": "src/index.js"` line (the file doesn't exist; the
   registry is a server, not an importable module).
2. Move `@types/pg`, `prettier`, `prisma` from `dependencies` to
   `devDependencies`. Keep `dotenv`, `pg`, `@prisma/adapter-pg`,
   `@prisma/client`, `elysia`, `@elysiajs/openapi` in `dependencies` (all are
   runtime imports). For `zod`: grep first (see Current state); if unused,
   note it in the report — removing it is optional and low-stakes.

**Verify**: `bun install` → exit 0; `bun --filter='registry' run check` →
exit 0 (this exercises `prisma generate` from its new devDependencies
position); `bun --filter='registry' run test` → pass.

### Step 4: Drop the unused docs dependency

Remove `"fuse.js": "^7.1.0"` from `apps/docs/package.json` dependencies.
Re-grep first to be safe: `grep -rn "fuse" apps/docs/src` must return nothing.

**Verify**: `bun install` → exit 0; `bun --filter='docs' run test:ci` → pass;
`bun run build` → exit 0.

## Test plan

No new tests — this plan's safety net is the existing suites, run at every
step (commands table). Final sweep: all five verification commands green, plus
`bun audit` output pasted into the executor report (counts before/after).

## Done criteria

- [ ] `bun audit` shows 0 critical; no `@vitest/browser`, `vite`, or `undici` advisories (hono-via-prisma may remain — record it)
- [ ] `grep -rn '"latest"' apps/*/package.json packages/*/package.json` → 0 matches
- [ ] `grep -c '"module"' apps/registry/package.json` → 0
- [ ] `prisma`, `prettier`, `@types/pg` under devDependencies in `apps/registry/package.json`
- [ ] `fuse.js` absent from `apps/docs/package.json`
- [ ] `bun run check`, `bun run build`, docs `test:ci`, registry `test`, sivir `test` all exit 0
- [ ] Changed files: only the three package.json files + `bun.lock`
- [ ] `plans/README.md` status row updated

## STOP conditions

- A bump forces source-code changes (API breakage in vitest/vite config) —
  report the exact error; do not patch source in this plan.
- `bun update` crosses a major version boundary for any package — pin
  explicitly within the current major instead; if impossible, report.
- Browser tests fail after step 1 in an environment where they passed before
  the change.
- `bun audit` still reports the vitest critical after step 1 (the fix isn't in
  the declared range — report the available patched version).

## Maintenance notes

- Accepted residual: `hono`/`@hono/node-server` advisories under
  `@prisma/dev` — unreachable from the deployed server; clears when Prisma
  updates. Re-check on Prisma bumps.
- `bun audit` in CI would catch this class earlier; consider adding a
  non-blocking audit step to `ci.yml` (deferred — noise risk needs a
  maintainer call).
- Reviewer focus: the `bun.lock` diff should only contain the intended
  packages and their transitive closures.
