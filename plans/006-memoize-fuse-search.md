# Plan 006: Stop rebuilding the Fuse search index on every keystroke

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

- **Status**: DONE — both indexes are derived from item/version state and browser behavior is green.
- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: https://github.com/aidan-neel/sivir-ui/issues/110

## Why this matters

Both search-driven components construct a **fresh Fuse.js instance inside the
`oninput` handler**, so every keystroke re-derives the items array and rebuilds
the entire fuzzy-search index before running one query. Index construction is
the expensive part of Fuse; for consumer apps with hundreds of Command/Combobox
items this is per-keystroke main-thread work that scales with list size. The
fix is to derive the index from the item set reactively (Svelte 5 `$derived`)
so it rebuilds only when the items change.

## Current state

- `packages/sivir/src/components/combobox/combobox-trigger.svelte` — inside
  `handleInput()` (fires on every input event):

  ```ts
  function handleInput() {
  	const itemsArray = Array.from(uiState.items);
  	const namesArray = itemsArray.map((item) => item.value);
  	const fuse = new Fuse(namesArray, { threshold });
  	const results = fuse.search(uiState.searchContent);
  	const resultSet = new Set<ComboboxItem>(
  		results.map((r) => itemsArray.find((item) => item.value === r.item)!)
  	);
  	uiState.results = resultSet;
  }
  ```

  Note the secondary cost: `itemsArray.find(...)` per result makes the mapping
  O(n·m); a Map keyed by `value` fixes that in passing.

- `packages/sivir/src/components/command/command-search.svelte` — same shape:
  `handleInput()` early-returns to "all items" on empty query, otherwise
  `new Fuse(namesArray, { threshold })` per keystroke, then the same
  `find`-per-result mapping keyed by `item.name`.
- `uiState.items` is reactive component state (a `Set` in a `$state`
  container — both files already read it reactively elsewhere).
- Existing behavioral coverage: the docs test suite has Combobox and Command
  browser tests (typing filters items, Enter selects first result) under
  `apps/docs/tests/` — they are the behavioral gate for this change.
- Conventions: tabs; Svelte 5 runes throughout the library (`$derived`,
  `$effect`); conventional commits (`perf(ui): …`).

## Commands you will need

| Purpose       | Command                                | Expected on success                                          |
| ------------- | -------------------------------------- | ------------------------------------------------------------ |
| Typecheck     | `bun run check` (root)                 | exit 0                                                       |
| Docs tests    | `bun --filter='docs' run test:ci`      | all pass                                                     |
| Browser tests | `bun --filter='docs' run test:browser` | all pass (if Playwright available; else note and rely on CI) |
| Format        | `bun run format:check` (root)          | exit 0                                                       |

## Scope

**In scope**:

- `packages/sivir/src/components/combobox/combobox-trigger.svelte`
- `packages/sivir/src/components/command/command-search.svelte`

**Out of scope**:

- Fuse options/threshold semantics — results must be identical for the same
  (items, query).
- Virtualization or any list-rendering change (audit finding PERF-05 was
  explicitly rejected as speculative).
- The color-picker pointermove batching (audit finding PERF-04) — plausible
  but unproven; do NOT fold it in here.
- Any other component; any docs-app code.

## Git workflow

- Branch: `advisor/006-memoize-fuse-search`
- One commit per file or one combined (`perf(ui): derive Fuse index from items instead of per keystroke`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Combobox — derive the index

In `combobox-trigger.svelte`, hoist out of `handleInput()`:

```ts
const searchIndex = $derived.by(() => {
	const itemsArray = Array.from(uiState.items);
	return {
		itemsByValue: new Map(itemsArray.map((item) => [item.value, item])),
		fuse: new Fuse(
			itemsArray.map((item) => item.value),
			{ threshold }
		)
	};
});
```

`handleInput()` becomes: search `searchIndex.fuse`, map results through
`searchIndex.itemsByValue.get(r.item)` (filter out `undefined` instead of the
current non-null assertion), assign `uiState.results`.

**Verify**: `bun run check` → exit 0.

### Step 2: Command — same transformation

Apply the identical pattern in `command-search.svelte` (key the Map by
`item.name`; keep the empty-query early-return exactly as is).

**Verify**: `bun run check` → exit 0.

### Step 3: Behavioral gate

Run the docs suites.

**Verify**: `bun --filter='docs' run test:ci` → all pass; if the environment
has Playwright Chromium, `bun --filter='docs' run test:browser` → all pass
(the Combobox/Command typing tests are the real gate). If browser tests can't
run locally, state that in the report — `browser-tests.yml` gates it on push.

## Test plan

No new test files: the existing Combobox/Command browser tests already assert
filter-as-you-type and Enter-selects-first behavior, which pins the observable
contract this change must preserve. If you find those tests do NOT cover
typing-filters-results for one of the two components, add one browser test for
it modeled on the existing combobox browser test file — otherwise skip.

## Done criteria

- [x] `grep -n "new Fuse" packages/sivir/src/components/combobox/combobox-trigger.svelte` → exactly 1 match, inside a `$derived` block, not inside `handleInput`
- [x] Same for `command-search.svelte`
- [x] No `!` non-null assertion in the result-mapping of either file
- [x] `bun run check` exits 0; `bun --filter='docs' run test:ci` exits 0
- [x] Browser tests pass locally (183/183 at completion)
- [x] The implementation changes are scoped to the two search components (Combobox also changed as part of Plan 012's state migration)
- [x] `plans/README.md` status row updated

## STOP conditions

- The excerpts don't match the live code (drift).
- `uiState.items` turns out not to be reactively tracked inside `$derived`
  (results stop updating when items mount late — the browser tests will catch
  this). Report; do not fall back to per-keystroke construction silently.
- Any observable behavior change in the tests (result ORDER matters — Fuse
  returns ranked results; the mapping must preserve Fuse's order exactly).

## Maintenance notes

- `threshold` is a prop; it's read inside `$derived`, so a threshold change
  rebuilds the index — correct and intended.
- If Command/Combobox ever accept 1,000+ items, revisit rejected finding
  PERF-05 (virtualization) with real numbers.
- Reviewer focus: Set→Map mapping must not deduplicate or reorder results.
