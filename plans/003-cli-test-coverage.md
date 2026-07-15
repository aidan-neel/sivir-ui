# Plan 003: Put the CLI under test (CI wiring + file-writing command coverage)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: Written against commit `41806b5` with a dirty
> working tree. Run `git diff --stat 41806b5..HEAD -- packages/sivir .github/workflows/ci.yml`
> and compare the "Current state" excerpts below against the live code before
> editing; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (plan 001 benefits from this landing first — a package
  should not be published while its CLI tests don't run in CI)
- **Category**: tests
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/107

## Why this matters

The `sivir` CLI writes files into **users' projects** (`sivir.json`, component
sources, `theme.css`) and spawns their package manager — the highest-blast-
radius code in the repo. Today: (a) the package's 13 existing tests
(`packages/sivir/cli/registry.test.ts`) **never run in CI** — `ci.yml` runs
only the docs and registry suites, so a commit that breaks `resolveInstallPlan`
lands green; (b) the three commands that actually touch the user's disk
(`init`, `add`, `theme`) and the utilities under them
(`installFile`, `declaredDependencies`, `detectPackageManager`) have **zero
tests**; (c) `scripts/build-registry.ts` — the generator whose output the CLI
installs from — has no output-schema check. This plan closes (a) in one step
and puts integration tests around every file-writing path.

## Current state

- `.github/workflows/ci.yml` — test steps today (excerpt):

  ```yaml
  - name: Test (unit + ssr)
    run: bun --filter='docs' run test:ci

  - name: Test (registry)
    run: bun --filter='registry' run test
  ```

  There is no step for the `@sivir/ui` package. (Root `bun run test` = `turbo
run test`, which _does_ include it — CI just doesn't use it.)

- `packages/sivir/package.json` scripts: `"test": "bun run build:registry && bun test"`.
  So the package's test run regenerates `registry/` first — in CI that's fine.
- `packages/sivir/cli/registry.test.ts` — the existing 13 tests and the
  **structural pattern to copy** for new tests (bun:test, `describe/it/expect`).
- `packages/sivir/cli/utils/project.ts` — untested utilities:
  - `detectPackageManager(cwd)` — sniffs lockfiles (`bun.lock`/`bun.lockb`,
    `pnpm-lock.yaml`, `yarn.lock`, else npm).
  - `declaredDependencies(cwd)` — `JSON.parse(await readFile(...))` with **no
    try/catch**: a malformed consumer `package.json` throws an unhandled
    SyntaxError all the way out of `sivir add`.
  - `installFile(cwd, dir, file, alias, overwrite)` — `path.join(cwd, dir,
file)` where `file` comes from the bundled registry snapshot. No guard
    that the resolved target stays under `path.join(cwd, dir)`. Today `file`
    is trusted (it ships inside the npm package), so this is
    defense-in-depth, not a live vulnerability — but it's one `..` in a
    future remote registry away from becoming one.
  - Copy semantics: existing file + no `overwrite` → `'skipped'`.
- `packages/sivir/cli/commands/theme.ts` — `resolveThemeCss(slug, registry)`
  checks bundled themes first, then `fetch(`${registry}/themes/${slug}`)`,
  parses JSON as `ThemeDraft`, renders `themeToCss(draft)`, writes
  `<cwd>/<config.dir>/theme.css`. Uses **global `fetch`** — stub it in tests
  via `globalThis.fetch = ...` (bun:test `mock` also works).
- `packages/sivir/cli/commands/add.ts` / `init.ts` — clack-driven; `add`
  prompts only when `!yes && process.stdout.isTTY`, so tests pass
  `{ yes: true }` or run non-TTY to avoid interactivity. `add` spawns the
  package manager via `spawnSync` **only** to install missing peer deps after
  a confirm — with `yes: false` and non-TTY it just prints the command.
- `packages/sivir/scripts/build-registry.ts` — generates
  `registry/index.json`, `registry/themes.json`, `registry/files/**`; throws
  on manifest references to missing files.
- Conventions: tabs; conventional commits (`test(cli): …`, `ci: …`).

## Commands you will need

| Purpose            | Command                                    | Expected on success               |
| ------------------ | ------------------------------------------ | --------------------------------- |
| Install            | `bun install --frozen-lockfile` (root)     | exit 0                            |
| Package tests      | `cd packages/sivir && bun run test`        | exit 0; 13 pass today, more after |
| Filtered (CI form) | `bun --filter='@sivir/ui' run test` (root) | same as above                     |
| Typecheck          | `bun run check` (root)                     | exit 0                            |
| Format             | `bun run format:check` (root)              | exit 0                            |

## Scope

**In scope**:

- `.github/workflows/ci.yml` (one added step)
- `packages/sivir/cli/utils/project.ts` (two small hardenings, see steps 3–4)
- `packages/sivir/cli/utils/project.test.ts` (create)
- `packages/sivir/cli/commands/commands.test.ts` (create — or one file per
  command if that matches `registry.test.ts` style better; your call, say so)
- `packages/sivir/scripts/build-registry.test.ts` (create)

**Out of scope**:

- Any behavior change to `add`/`init`/`theme` beyond what a test exposes as an
  unhandled crash (see steps 3–4 for the two sanctioned hardenings).
- `apps/docs/tests/**` (component tests — separate concern, unplanned finding
  TEST-04 in `plans/README.md`).
- Rewriting the clack UI layer or making commands dependency-injectable —
  test through temp dirs and env, not by refactoring.

## Git workflow

- Branch: `advisor/003-cli-test-coverage`
- Conventional commits (`ci: run @sivir/ui package tests`, `test(cli): cover
installFile overwrite semantics`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Run the package tests in CI

In `.github/workflows/ci.yml`, after the "Test (registry)" step add:

```yaml
- name: Test (sivir package)
  run: bun --filter='@sivir/ui' run test
```

**Verify**: locally, `bun --filter='@sivir/ui' run test` from the repo root →
exit 0, "13 pass" (or current count). If the filter doesn't match, check the
workspace name with `bun pm ls` — do not guess alternates silently.

### Step 2: Unit tests for `utils/project.ts`

Create `packages/sivir/cli/utils/project.test.ts` (pattern:
`registry.test.ts`). Use `fs.mkdtemp(os.tmpdir())` per test, clean up in
`afterEach`. Cases:

- `detectPackageManager`: one temp dir per lockfile type → expected manager;
  empty dir → `'npm'`.
- `declaredDependencies`: valid package.json with deps/devDeps/peerDeps →
  union set; missing file → empty set; malformed JSON → see step 3.
- `installFile`: fresh install → `'created'` + content has alias rewritten
  (`@sivir/ui` → `$lib/sivir`); existing target without overwrite →
  `'skipped'` + content untouched; with overwrite → `'overwritten'`.
  Point it at a real file from the built `registry/files/` snapshot (the test
  script runs `build:registry` first, so it exists).

**Verify**: `cd packages/sivir && bun run test` → all pass.

### Step 3: Harden `declaredDependencies` against malformed package.json

Sanctioned change: wrap the `JSON.parse` in try/catch; on failure return
`new Set()` (the caller then treats all peers as missing, which degrades to a
harmless "missing peer dependencies" warning). Add the test: malformed JSON →
empty set, no throw.

**Verify**: `cd packages/sivir && bun run test` → passes, including new case.

### Step 4: Add a containment guard to `installFile`

Sanctioned change (defense-in-depth): before writing, resolve
`const base = path.resolve(cwd, dir)` and `const target = path.resolve(base, file)`;
if `!target.startsWith(base + path.sep)` throw a plain `Error`
(`unsafe registry file path: <file>`). Tests: `file` of `'../../evil.txt'` and
an absolute path both throw; normal nested file still installs.

**Verify**: `cd packages/sivir && bun run test` → passes, including both new
cases.

### Step 5: Integration tests for the three commands

Create command tests (temp-dir based, `{ cwd: tmpDir }`):

- `init`: run against an empty temp dir (pass whatever non-interactive options
  `init.ts` exposes — read its signature first; if init cannot run without a
  TTY prompt, test the underlying pieces it calls instead and report that
  limitation). Assert `sivir.json` exists and parses to the default shape.
- `add` happy path: temp dir with a valid `sivir.json` (write
  `DEFAULT_CONFIG`-shaped JSON yourself) and a minimal `package.json`; run
  `add(['button'], { cwd, yes: false, overwrite: false })` in non-TTY; assert
  component files appear under `src/lib/sivir/`, imports are alias-rewritten,
  and `sivir.json` now records the component version.
- `add` skip semantics: pre-create one target file, run without overwrite →
  `'skipped'` behavior (file content unchanged).
- `add` unknown component: `add(['buttom'], ...)` → `process.exitCode` set to
  1 and no files written (reset `process.exitCode` after each test).
- `theme` from bundled preset: config + `addTheme('<a slug from
registry/themes.json>')` → `theme.css` written with the `/* sivir theme:`
  header.
- `theme` registry fallback: stub `globalThis.fetch` to return a valid
  `ThemeDraft` JSON → `theme.css` written; stub a 404 → `process.exitCode` 1
  and no file; stub a network throw → same.

**Verify**: `cd packages/sivir && bun run test` → all pass, total ≥ 25.

### Step 6: Output-schema test for `build-registry.ts`

Test that runs the generator (import its main function if exported, else
`Bun.spawnSync(['bun', 'scripts/build-registry.ts'])` with cwd
`packages/sivir`) and asserts: `registry/index.json` parses; every
`components[].files` entry exists under `registry/files/`; every
`components[].components` dependency name exists in the index; `themes.json`
parses and every theme has `slug` and `css`.

**Verify**: `cd packages/sivir && bun run test` → passes.

## Test plan

The steps above ARE the test plan. Structural pattern:
`packages/sivir/cli/registry.test.ts`. Runner: `bun test` (bun:test, no vitest
here). Final verification: `bun --filter='@sivir/ui' run test` → 0 fail, and
`bun run check` → exit 0.

## Done criteria

- [ ] `ci.yml` contains a `Test (sivir package)` step running `bun --filter='@sivir/ui' run test`
- [ ] `bun --filter='@sivir/ui' run test` exits 0 with ≥ 25 tests passing
- [ ] `grep -n "startsWith(base" packages/sivir/cli/utils/project.ts` → 1 match (containment guard)
- [ ] `declaredDependencies` malformed-JSON test exists and passes
- [ ] `bun run check` exits 0; `bun run format:check` exits 0
- [ ] `git status --porcelain` shows changes only in in-scope files
- [ ] `plans/README.md` status row updated

## STOP conditions

- Excerpt/code mismatch (drift).
- `init` genuinely cannot run non-interactively and its structure resists
  testing the pieces (report what you found; do not refactor the command to
  make it testable — that's a scope change).
- The containment guard (step 4) breaks a legitimate registry file path
  (a component actually installs outside `config.dir` today — that would be a
  real product behavior this plan must not silently change; report it).
- Tests need network access to pass (they must not — stub `fetch`).

## Maintenance notes

- Once plan 001's publish workflow exists, mirror the new CI test step there.
- The temp-dir command tests become characterization tests for any future CLI
  refactor (e.g. remote-registry `add`) — extend them first when that work
  starts, especially around the containment guard.
- Reviewer focus: no test should read or write outside its mkdtemp sandbox;
  `process.exitCode` must be reset between tests (bun runs files in one
  process).
- Deferred: component-level docs tests (TEST-04) and Theme Studio persistence
  tests (TEST-08) — see "Findings without plans" in `plans/README.md`.
