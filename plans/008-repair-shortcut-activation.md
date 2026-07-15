# Plan 008: Repair Shortcut activation and key parsing

> **Executor instructions**: Follow the steps in order, run every verification
> command, and stop on a STOP condition. Update `plans/README.md` when done.
>
> **Drift check**: Written against commit `41806b5` and the dirty working tree
> audited on 2026-07-14. Before editing, confirm the excerpts below still match.

## Status

- **Priority**: P0
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: correctness / accessibility

## Why this matters

The documented contract says a Shortcut nested in a Button activates that
Button. It currently cannot: Shortcut reads a generic global state entry whose
Button-side producer was removed. Rendering still works, so the regression is
silent and the test suite stayed green.

## Current state

- `shortcut.svelte:11-15` reads `states[key]?.data.onclick` from generic
  context; `button.svelte` no longer creates that context or state.
- `shortcut.svelte:25-48` advertises aliases including `meta`, `option`,
  `return`, `esc`, arrows, `space`, and `plus`, while `handleKey` recognizes
  only a subset and compares the rest directly to `KeyboardEvent.key`.
- `Command.Trigger` contains `cmd+k` and `ctrl+k` Shortcuts, but its nearest
  generic context is Command state, not Button state.
- Shortcut has only an SSR no-throw test; no browser test activates an action.

## Scope

In scope: Shortcut behavior/types/manifest, the minimum Button integration,
registry regeneration, browser tests, and examples that claim activation.

Out of scope: a general hotkey manager, configurable scopes, sequences such as
`g g`, or reintroducing Button into the process-global state registry.

## Implementation

### Step 1: Replace the deleted state contract with DOM ownership

In `shortcut.svelte`, bind the `<kbd>` element. On a matching chord:

1. call an optional explicit `ontrigger` prop when supplied; otherwise
2. find `kbd.closest('button, a[href], [role="button"]')` and invoke its native
   `click()` method;
3. do nothing for disabled / `aria-disabled="true"` owners.

Delete the `states` and `getContext('key')` imports and the local
`ButtonStateShape`. This keeps Shortcut copyable, works through wrappers such
as `Command.Trigger`, and adds no new shared state or internal file.

### Step 2: Normalize display and matching through one parser

Parse the chord once into `{ meta, ctrl, shift, alt, key }`. Use the same
normalized representation for glyphs and event matching. Required aliases:

- meta: `cmd`, `command`, `meta`
- control: `ctrl`, `control`
- option: `alt`, `option`, `opt`
- keys: `enter`/`return`, `esc`/`escape`, `space`, arrows, `plus`, `delete`,
  `backspace`, `tab`, and printable single-character keys

Require exact modifier equality, ignore `event.repeat`, and ignore events from
`input`, `textarea`, `select`, or contenteditable targets. Call
`preventDefault()` only after a full match and an actionable target exists.
Warn in development, or fail parsing safely, for empty chords, multiple base
keys, and unknown multi-character key names.

### Step 3: Pin the behavior with browser tests

Add a dedicated fixture/test covering:

- nested Button activation, including `Command.Trigger` opening a palette;
- standalone `ontrigger` activation;
- all documented aliases and exact-modifier rejection;
- editable-target, disabled-target, repeat, and unmount cleanup behavior;
- display glyphs produced by the same aliases used for matching.

Update the SSR test to pass the required `shortcut` prop. Remove
`internals/state` from Shortcut's manifest and rebuild the registry.

## Verification

```sh
bun --filter='@sivir/ui' run test
bun run check
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun --filter='@sivir/ui' run build
bun run format:check
```

## Done criteria

- [ ] Navbar `/`, Cmd+K, and Ctrl+K shortcuts open Command in a browser test
- [ ] Every displayed alias is normalized and tested for activation
- [ ] Shortcut has no dependency on generic context or global `states`
- [ ] Listeners are removed on unmount and do not fire in editable controls
- [ ] Source and generated registry copies match
- [ ] All verification commands pass

## STOP conditions

- Native `click()` causes double activation for any nested Button case.
- A proposed fix reintroduces module-global component state.
- The live Shortcut API intentionally differs from the manifest/docs; report
  the desired public contract before changing it.

## Maintenance notes

Keep parsing and glyph rendering in one table. A key name may not be added to
the display table without a matching browser test.
