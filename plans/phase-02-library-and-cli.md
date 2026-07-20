# Phase 2: Stabilize The Library And CLI

## Status

**DONE — 2026-07-19.**

## Delivered

### 1. Public API lock

- `packages/sivir/public-api.test.ts` — barrel, parts, exports map, CLI registry,
  Card panel helpers
- Catalog locked at 38

### 2. Component blockers

| Item                      | Result                                                       |
| ------------------------- | ------------------------------------------------------------ |
| Nested body scroll lock   | Shared `lockBodyScroll` / `lockBodyBackground`               |
| Controlled Popover open   | Mount-open covered                                           |
| Modal/Sheet focus restore | Browser tests                                                |
| Submenu cone              | Ancestor dismiss; Escape peels one level (`pushEscapeLayer`) |
| Outside-click             | Select, Dropdown, Combobox, ContextMenu                      |
| Sheet test drift          | Real transition wait; open SSR asserts                       |

### 3. Package install

- `verify:artifact` — pack allowlist, fresh SvelteKit consumer check + build

### 4. CLI source copy

- Sandbox 15/15
- `verify:cli-artifact` — retained `.release/*.tgz` only; packed `sivir` binary;
  init/add/theme; asserts `registry.sivir.dev` default in generated config
  (CLI default URL; remote registry **service** still not a v1 product)

### 5. CI

- `check:cli` + `check:components`
- CI + publish run sandbox, `verify:artifact`, `verify:cli-artifact`

## Known follow-up (not phase-exit blockers unless still broken at RC)

- **Command fuzzy search quality** — still reported rough in product use; must
  be fixed or explicitly accepted before Phase 4 go.

## Exit criteria

- [x] Exports / install graphs locked
- [x] Package + CLI fresh consumers green
- [x] No open P0/P1 from this phase’s blocker list
- [x] Artifact gates in CI
