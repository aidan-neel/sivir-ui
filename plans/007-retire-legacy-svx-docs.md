# Plan 007: Retire the legacy .svx docs pipeline (one content system, not two)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: Written against commit `41806b5` with a dirty
> working tree. Compare the "Current state" excerpts against the live code
> before editing; on a mismatch, STOP.

## Status

- **Priority**: P3
- **Effort**: S–M
- **Risk**: MED (deleting a routing path; fully gated by the parity check in step 1)
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/111

## Why this matters

The docs app runs **two component-docs systems in parallel**. The current one:
42 explicit routes at `apps/docs/src/routes/docs/components/<name>/+page.svelte`
with live examples imported via Vite `?raw`. The legacy one: 32 mdsvex `.svx`
files in `apps/docs/src/lib/content/` served by a catch-all route
`docs/components/[...slug]` that globs them and **prerenders an entry for every
one**. Explicit routes shadow the catch-all at matching URLs, so the legacy
pages are (probably — step 1 verifies) unreachable, yet they still compile,
still prerender, still get maintained by accident (the rebrand sweep just
modified all 32), and still confuse every "which file do I edit?" decision.
Git history says this system was already removed once (PR #73, "Remove legacy
.svx docs system") — this plan finishes the job: verify parity, then delete
the catch-all, the content dir, and the now-unused mdsvex plumbing.

## Current state

- `apps/docs/src/routes/docs/components/[...slug]/+page.ts` — the catch-all:

  ```ts
  const markdownFiles = import.meta.glob('/src/lib/content/*.svx');
  ...
  export const load: PageLoad = async (event) => {
  	if (event.params.slug === 'components') {
  		redirect(303, '/docs/components/alert');
  	}
  	const filePath = `/src/lib/content/${event.params.slug}.svx`;
  	...
  };
  export const entries: EntryGenerator = () => { /* one entry per .svx */ };
  ```

  There is a sibling `+page.svelte` in the same directory that renders the
  loaded content (read it before deleting; confirm nothing else imports it).

- `apps/docs/src/lib/content/` — 32 `.svx` files (alert.svx, button.svx, …).
- `apps/docs/src/routes/docs/components/` — 43 entries: 42 explicit component
  dirs + `[...slug]`.
- `apps/docs/svelte.config.js:19` — `extensions: ['.svelte', '.svx', '.md']`,
  with an mdsvex preprocessor configured earlier in the file (read the whole
  file; the mdsvex import and preprocess entry go away only if nothing else
  uses `.svx`/`.md` page files — step 3 verifies).
- `apps/docs/package.json` — `"mdsvex": "^0.12.7"` in devDependencies.
- One behavior to preserve: the `/docs/components` → `/docs/components/alert`
  redirect currently lives in the catch-all's load function. It must survive
  the deletion (step 4).
- Conventions: conventional commits (`chore(docs): …`); tabs.

## Commands you will need

| Purpose    | Command                           | Expected on success         |
| ---------- | --------------------------------- | --------------------------- |
| Typecheck  | `bun run check` (root)            | exit 0                      |
| Docs tests | `bun --filter='docs' run test:ci` | all pass                    |
| Build      | `bun --filter='docs' run build`   | exit 0 (prerender included) |
| Format     | `bun run format:check` (root)     | exit 0                      |

## Scope

**In scope**:

- `apps/docs/src/routes/docs/components/[...slug]/` (delete, after step 1)
- `apps/docs/src/lib/content/` (delete, after step 1)
- `apps/docs/svelte.config.js` (mdsvex removal, only if step 3 confirms)
- `apps/docs/package.json` (drop mdsvex, same condition)
- A redirect home for `/docs/components` (see step 4)

**Out of scope**:

- The 42 explicit component routes and their examples — the live system.
- `apps/docs/src/lib/components/docs/**` (shared doc-kit primitives).
- Non-component docs routes (`docs/installation`, `docs/introduction`, …).

## Git workflow

- Branch: `advisor/007-retire-legacy-svx-docs`
- Commits: parity evidence first (no-op), then the deletion, then config.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Parity check — every .svx page must have an explicit replacement

```
ls apps/docs/src/lib/content/*.svx | xargs -n1 basename | sed 's/\.svx$//' | sort > /tmp/svx-slugs.txt
ls -d apps/docs/src/routes/docs/components/*/ | xargs -n1 basename | grep -v '^\[' | sort > /tmp/route-slugs.txt
comm -23 /tmp/svx-slugs.txt /tmp/route-slugs.txt
```

**Verify**: `comm` output is EMPTY (every .svx slug has an explicit route).
If ANY slug appears, that page is served _only_ by the legacy system — STOP
and report the list; deleting would 404 real pages.

### Step 2: Delete the legacy pipeline

Delete `apps/docs/src/routes/docs/components/[...slug]/` (both files) and
`apps/docs/src/lib/content/` entirely.

**Verify**: `grep -rn "lib/content" apps/docs/src` → 0 matches.

### Step 3: Remove mdsvex only if nothing else uses it

```
find apps/docs/src -name '*.svx' -o -name '*.md' | grep -v node_modules
grep -rn "mdsvex" apps/docs/svelte.config.js apps/docs/src
```

If both come back empty (post step 2), remove the mdsvex import + preprocessor
entry + `.svx`/`.md` extensions from `svelte.config.js`, and `mdsvex` from
`apps/docs/package.json`; run `bun install`. If anything still uses it, leave
config and dependency alone and note it.

**Verify**: `bun run check` → exit 0.

### Step 4: Preserve the /docs/components redirect

The deleted load function handled `/docs/components` → 303 to
`/docs/components/alert`. Recreate minimally: add
`apps/docs/src/routes/docs/components/+page.ts` (or `+page.server.ts`,
matching how other redirects in this app are done — search for `redirect(`
under `apps/docs/src/routes` and copy the prevailing pattern) containing just
that redirect.

**Verify**: `bun --filter='docs' run build` → exit 0; build output/prerender
log contains no errors about `/docs/components`.

### Step 5: Full gate

**Verify**: `bun run check`, `bun --filter='docs' run test:ci`,
`bun --filter='docs' run build`, `bun run format:check` — all exit 0. Compare
the prerendered page count in the build log against a pre-change build if you
captured one; expect it to drop by roughly the number of .svx-only entries
(the catch-all prerendered one page per .svx) and report the before/after
numbers.

## Test plan

No new test files. The gates: parity check (step 1), typecheck, docs unit+ssr
suite, and a successful prerender build. If an existing docs test imports from
`$lib/content` (step 2's grep will surface it), that test belongs to the
legacy system — report it, don't silently delete tests.

## Done criteria

- [ ] Step 1 `comm` output empty (recorded in the report)
- [ ] `apps/docs/src/lib/content/` and the `[...slug]` route no longer exist
- [ ] `grep -rn "lib/content\|mdsvex" apps/docs/src apps/docs/svelte.config.js` → 0 matches (or mdsvex retained with reason)
- [ ] `/docs/components` redirect exists in a new `+page.ts`
- [ ] `bun run check`, docs `test:ci`, docs `build`, `format:check` all exit 0
- [ ] `git status --porcelain` shows changes only in in-scope paths
- [ ] `plans/README.md` status row updated

## STOP conditions

- Step 1 finds .svx-only slugs.
- Any docs test or component imports from `$lib/content` or the `[...slug]`
  route (grep reveals a live consumer).
- The build's prerender FAILS after deletion (an `entries`-generated URL was
  load-bearing somewhere unexpected — report the failing URL).
- `svelte.config.js` mdsvex removal breaks non-component pages (some
  `docs/introduction`-style page is secretly a `.md`/`.svx` file — step 3's
  find should catch this first).

## Maintenance notes

- After this lands, "add a component docs page" has exactly one answer: create
  `routes/docs/components/<name>/+page.svelte` following the button page
  (the doc-kit reference, per `docs/superpowers/revamp-execution-notes.md`).
- Reviewer focus: the diff should be almost entirely deletions; the only
  additions are the redirect file and svelte.config.js simplification.
- Deferred: `docs/superpowers/` and `docs/theme-studio/` planning-artifact
  dirs were deliberately kept (they ground decisions and future audits) — see
  "considered and rejected" in `plans/README.md`.
