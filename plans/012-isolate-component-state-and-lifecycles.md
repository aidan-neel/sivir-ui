# Plan 012: Isolate component state and close overlay lifecycle leaks

> **Drift check**: Written against commit `41806b5` and the dirty working tree
> audited on 2026-07-14.

## Status

- **Status**: DONE — all compound families use typed symbol contexts; the global registry was deleted and lifecycle race coverage is green.
- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plan 009 establishes the context pattern
- **Category**: correctness / SSR / architecture

## Why this matters

Public components store state in a process-global registry. Several never
destroy their entries, and module scope is unsafe for concurrent SSR requests.
The click-outside action can also install a document listener after it has
already been destroyed.

## Current state

- `internals/state.svelte.ts:20-30` stores every instance in exported module
  state keyed by random strings.
- Modal, Sheet, Collapsible, and Switch register state without teardown.
- About twenty children cast `states[key]` from generic string context.
- `utils.ts:145-152` schedules listener installation but destroy cannot cancel
  the timer.

## Implementation

1. Inventory every `useState`, `states[...]`, `setContext('key')`, and
   `getContext('key')` use; group by compound component.
2. Migrate each family to a module-private symbol context carrying the typed
   state object directly. Seed props synchronously for SSR and keep bindable
   state synchronization explicit.
3. Delete the process-global registry when the last consumer is gone. Keep an
   external store only if a public cross-tree API demonstrably needs one.
4. Retain the click-outside timeout handle, cancel it in destroy, and guard
   against post-destroy installation.
5. Add repeated mount/unmount, concurrent SSR, child-outside-root error, and
   immediate-destroy listener tests.

## Verification

```sh
rg -n "useState|states\[|setContext\(['\"]key|getContext\(['\"]key" packages/sivir/src
bun --filter='@sivir/ui' run test
bun run check
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun run build
```

## Done criteria

- [x] No component state is retained in a process-global registry
- [x] Compound children use typed symbol contexts and fail clearly when misused
- [x] Concurrent SSR instances cannot observe each other's state
- [x] Click-outside cannot install after destroy
- [x] Repeated open/mount/unmount tests show no listener or body-lock leakage

## STOP conditions

- A component intentionally exposes cross-tree state and no equivalent scoped
  API is approved.
- The migration changes a public `stateKey` contract used by documented code;
  report the compatibility choice before removal.
