# Plan 001: Make `@sivir/ui` installable from npm (packaging + publish pipeline)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: This plan was written against commit `41806b5`
> with a **dirty working tree** (mid silk→sivir rebrand; `packages/sivir/` is
> new on disk and may be uncommitted). `git diff --stat 41806b5..HEAD -- packages/sivir .github/workflows`
> tells you what has been committed since. Regardless of its output, compare
> every "Current state" excerpt below against the live file before editing it;
> on a mismatch, treat it as a STOP condition.

## Status

**DONE — 2026-07-15.** The package now ships complete metadata, license,
public exports, source, generated registry, and CLI. The release workflow
verifies and publishes the exact tarball with npm provenance.

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (soft dependency: plan 003 wires the package's tests into CI — land it before tagging the first real release if possible)
- **Category**: dx
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree — see drift check)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/106

## Why this matters

The docs site tells every visitor to run `bunx @sivir/ui init`, but the package
has **never been published**: `npm view @sivir/ui version` returns E404
(verified 2026-07-06; the pre-rebrand `@silk-ui/cli` is also gone from npm).
Every install command in the public docs fails for every real user. The
repository has CI (`.github/workflows/ci.yml`) but no publish/release
workflow — an earlier publish workflow for `@silk-ui/cli` (PR #77) was removed
during the library repackaging. This plan makes the package publishable,
correct, and publishes it via a repeatable workflow. It is the single biggest
release-readiness blocker in the repo.

## Current state

- `packages/sivir/package.json` — the publishable package. Relevant excerpt
  (verify before editing):

  ```json
  {
  	"name": "@sivir/ui",
  	"version": "0.1.0",
  	"license": "MIT",
  	"sideEffects": ["**/*.css"],
  	"files": ["src", "dist", "registry"],
  	"bin": { "sivir": "./dist/index.js" },
  	"svelte": "./src/index.ts",
  	"types": "./src/index.ts",
  	"publishConfig": { "access": "public" },
  	"scripts": {
  		"build:registry": "bun scripts/build-registry.ts",
  		"build": "bun run build:registry && bun build cli/index.ts --outdir dist --target node --banner '#!/usr/bin/env node'",
  		"prepublishOnly": "bun run build"
  	}
  }
  ```

  Notes: there is **no `repository`, `homepage`, `bugs`, or `keywords` field**,
  and `LICENSE` is at the **repo root**, not inside `packages/sivir/`, so npm
  will NOT include license text in the tarball.

- `packages/sivir/src/index.ts` — the public barrel. It exports ~34 components
  but **omits `Panel` and `Separator`**, which both exist, are documented on the
  docs site (`apps/docs/src/routes/docs/components/panel`, `.../separator`),
  and have proper named exports:
  - `packages/sivir/src/components/panel/index.ts` ends with `export { Panel }; export default Panel;`
  - `packages/sivir/src/components/separator/index.ts` ends with `export { Separator }; export default Separator;`
    The barrel's single-element section looks like (excerpt, around lines 17–33):

  ```ts
  export { Badge } from './components/badge';
  export { Button } from './components/button';
  ...
  export { Pagination } from './components/pagination';
  export { Progress } from './components/progress';
  export { ScrollArea } from './components/scroll-area';
  ```

- `.github/workflows/ci.yml` — existing CI. Uses `oven-sh/setup-bun@v2` with
  `bun-version: 1.3.11`, `bun install --frozen-lockfile`, and cache blocks for
  `~/.bun/install/cache` keyed on `bun.lock`. **Mirror this setup** in the new
  publish workflow.
- `.github/workflows/` — contains only `ci.yml` and `browser-tests.yml`. No
  publish workflow exists.
- Repo conventions: conventional-commit-style messages (`feat(cli): …`,
  `ci: …`, `docs: …` — see `git log --oneline -15`); tabs for indentation in
  JSON/TS (match `packages/sivir/package.json`).

## Commands you will need

| Purpose         | Command                                      | Expected on success                        |
| --------------- | -------------------------------------------- | ------------------------------------------ |
| Install         | `bun install --frozen-lockfile` (repo root)  | exit 0                                     |
| Typecheck       | `bun run check` (repo root)                  | exit 0, `svelte-check found 0 errors`      |
| Package tests   | `cd packages/sivir && bun run test`          | exit 0, all pass                           |
| Build package   | `cd packages/sivir && bun run build`         | exit 0; `dist/index.js` regenerated        |
| Pack dry-run    | `cd packages/sivir && npm pack --dry-run`    | tarball listing printed (see criteria)     |
| Publish dry-run | `cd packages/sivir && npm publish --dry-run` | exit 0, no auth error (dry-run skips auth) |
| Format check    | `bun run format:check` (repo root)           | exit 0                                     |

## Scope

**In scope** (the only files you should modify):

- `packages/sivir/package.json`
- `packages/sivir/src/index.ts`
- `packages/sivir/LICENSE` (create — copy of root `LICENSE`)
- `.github/workflows/publish.yml` (create)

**Out of scope** (do NOT touch, even though they look related):

- `apps/docs/**` — docs already document the correct commands; they start
  working the moment the package exists on npm.
- `packages/sivir/cli/**`, `packages/sivir/scripts/**` — the build already
  produces a working `dist/index.js`; do not refactor the CLI here.
- Version number bumps beyond what step 5 says — v1.0.0 messaging is a
  maintainer decision (see Maintenance notes).
- `.github/workflows/ci.yml` and `browser-tests.yml`.

## Git workflow

- Branch: `advisor/001-publish-sivir-ui`
- Commit per step, conventional style, e.g. `fix(ui): export Panel and Separator from the barrel`, `ci: add npm publish workflow for @sivir/ui`.
- Do NOT push, tag, or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the missing barrel exports (Panel, Separator)

In `packages/sivir/src/index.ts`, add to the single-element components section
(alphabetical order — after `Pagination`/before `Progress` for Panel; after
`ScrollArea`/before `Shortcut` for Separator):

```ts
export { Panel } from './components/panel';
...
export { Separator } from './components/separator';
```

**Verify**: `grep -n "export { Panel }\|export { Separator }" packages/sivir/src/index.ts` → both lines present. Then `bun run check` (repo root) → exit 0.

### Step 2: Complete package metadata

In `packages/sivir/package.json` add (tabs, matching file style):

```json
"repository": { "type": "git", "url": "git+https://github.com/aidan-neel/sivir-ui.git", "directory": "packages/sivir" },
"homepage": "https://github.com/aidan-neel/sivir-ui#readme",
"bugs": "https://github.com/aidan-neel/sivir-ui/issues",
"keywords": ["svelte", "sveltekit", "components", "ui", "tailwind", "shadcn"]
```

**Verify**: `cd packages/sivir && node -e "const p=require('./package.json'); if(!p.repository||!p.homepage) process.exit(1)"` → exit 0. `bun run format:check` at root → exit 0 (run `bun run format` if prettier complains about the new lines, then re-check).

### Step 3: Ship the license in the tarball

Copy the repo-root `LICENSE` to `packages/sivir/LICENSE` (byte-identical). npm
includes a package-dir `LICENSE` automatically regardless of the `files` list.

**Verify**: `diff LICENSE packages/sivir/LICENSE` → no output.

### Step 4: Verify the tarball contents

```
cd packages/sivir && bun run build && npm pack --dry-run
```

**Verify** the printed file list contains ALL of: `LICENSE`, `README.md`,
`package.json`, `dist/index.js`, `registry/index.json`, `registry/themes.json`,
at least one `registry/files/**` entry, and `src/index.ts`. If `registry/` is
missing, `build:registry` did not run — STOP condition.

### Step 5: Create the publish workflow

Create `.github/workflows/publish.yml`:

- Triggers: `workflow_dispatch` (manual) and `push: tags: ['v*']`.
- `permissions: contents: read` (add `id-token: write` only if you enable npm
  provenance).
- Steps, mirroring `ci.yml` exactly for checkout/bun/cache: checkout →
  setup-bun `1.3.11` → bun-cache block copied from ci.yml → `bun install
--frozen-lockfile` → `bun run check` → `cd packages/sivir && bun run test` →
  `cd packages/sivir && npm publish --access public` with
  `env: NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` and a prior step writing
  `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}` to `~/.npmrc` (or use
  `actions/setup-node@v4` with `registry-url: https://registry.npmjs.org` and
  let it wire the token — either is fine; pick one and be consistent).
- Do NOT bump the version in this plan; `0.1.0` is correct for the first
  publish.

**Verify**: `bunx yaml-lint .github/workflows/publish.yml` if available, else
`node -e "require('js-yaml')"`-style checks are NOT required — instead run
`grep -c "NPM_TOKEN" .github/workflows/publish.yml` → ≥1, and visually confirm
the workflow has no `pull_request` trigger (publish must never run on PRs).

### Step 6: Full local dry-run

```
cd packages/sivir && npm publish --dry-run
```

**Verify**: exit 0 and the summary shows the same file list as step 4. The
actual publish is intentionally NOT part of this plan (requires the
maintainer's `NPM_TOKEN` secret and their go-ahead).

## Test plan

- No new test files. The verification gates are: `bun run check`,
  `cd packages/sivir && bun run test` (existing 13 CLI tests must still pass —
  they cover `resolveInstallPlan`, `rewriteImports`, etc. in
  `packages/sivir/cli/registry.test.ts`), and the pack/publish dry-runs above.

## Done criteria

Machine-checkable. ALL must hold:

- [x] `bun run check` exits 0
- [x] `cd packages/sivir && bun run test` exits 0
- [x] Panel and Separator are public barrel exports
- [x] Package license is byte-identical to the repository license
- [x] The verified tarball contains the package allowlist, including registry and source
- [x] Publish is release-only, token-authenticated, and provenance-enabled
- [x] Package/release changes were reviewed in the coordinated release sweep
- [x] `plans/README.md` status row updated

## Completion report

- Package tests: 48 passing.
- Exact artifact: 513 allowlisted files, installed and built in a fresh
  SvelteKit consumer before publication.
- Workflow: full workspace tests and builds run before npm publishes the same
  verified `.tgz`; release tag and package version must match.

## STOP conditions

Stop and report back (do not improvise) if:

- The excerpts in "Current state" don't match the live files (drift).
- `npm pack --dry-run` omits `registry/` even after `bun run build` succeeds
  (the build script's output location changed — the packaging assumption is
  broken).
- `npm view @sivir/ui version` no longer 404s (someone published while this
  plan was pending — versioning strategy must be revisited by the maintainer).
- You are asked/tempted to actually run `npm publish` without a dry-run flag —
  that is the maintainer's call, not this plan's.

## Maintenance notes

- The README v1-milestone badge vs `0.1.0` version is deliberate mixed
  messaging the maintainer should resolve at first publish (either declare
  0.x public alpha in the README or define v1 criteria). Deferred here.
- When plan 003 lands (CLI tests in CI), consider making the publish workflow
  depend on the same test steps so a release can't ship with failing CLI tests.
- Reviewers should scrutinize: the token wiring in publish.yml (no token in
  logs), and that `prepublishOnly` still rebuilds `registry/` so the published
  snapshot matches `src/`.
- Follow-up explicitly deferred: npm provenance (`--provenance` + `id-token:
write`), changelog automation (see finding DOCS-01 in the audit — a
  `CHANGELOG.md` is still worth adding by hand).
