# Plan 009: Make Command a real Modal-backed command palette

> **Executor instructions**: Follow the steps in order and update the plan
> index on completion.
>
> **Drift check**: Written against commit `41806b5` and the dirty working tree
> audited on 2026-07-14. Stop if Command or Modal structure no longer matches
> the excerpts below.

## Status

- **Priority**: P0
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (Plan 008 validates the nested shortcut afterward)
- **Category**: correctness / accessibility / architecture

## Why this matters

Command draws a backdrop but independently reimplements the modal lifecycle.
It therefore misses Modal's stronger animation contract and can leave focus
listeners/body overflow behind when destroyed open. A command palette is a
modal dialog and should compose that primitive instead of maintaining a fork.

## Current state

- `command-content.svelte:25-60` hand-rolls portal, scroll locking, focus trap,
  focus selection, and cleanup; its open-state effect returns no teardown.
- `command-content.svelte:63-98` duplicates overlay/dialog markup and uses the
  generic 2px/.97 panel motion.
- `modal-content.svelte:43-51` uses shared `useOverlay`; lines 72-74 apply the
  visible modal 8px/.92 centered motion.
- `command.svelte` initializes `open: false`, copies the prop only in a client
  effect, and does not expose a bindable open state.
- Command results use orphaned `role="menuitem"` nodes and Enter always selects
  the first result; arrow navigation is absent.
- Command's manifest claims a Popover dependency even though Command source
  imports no Popover.

## Scope

Command and the Modal extension points required for composition; their
manifests/registry copies; Command browser and axe coverage.

Out of scope: visual redesign, fuzzy-search performance (Plan 006), or a
general combobox rewrite.

## Implementation

### Step 1: Give Modal and Command independent typed contexts

Replace their generic string context/global registry lookup with small
symbol-keyed context helpers. Modal children read Modal state; Command search,
groups, and items read Command state. This is required so both roots can be
nested without one component's `"key"` shadowing the other.

Do not add another module-global registry. Preserve stable IDs in instance
state and SSR-safe initial `open` values.

### Step 2: Compose the public pieces

- `Command.Root`: expose `open = $bindable(false)`, create only Command's item,
  result, search, and active-item state, and render children inside
  `<Modal.Root bind:open>`.
- `Command.Trigger`: delegate to `Modal.Trigger` rather than mutating Command
  state directly.
- `Command.Content`: render `Modal.Content` with `showClose={false}`, a Command
  label, the appropriate large width, and Command's zero-padding/overflow
  surface styling.
- Add the narrowest Modal.Content extension point needed for its inner surface
  class (for example `surfaceClass`); do not fork its portal, overlay,
  transition, focus, Escape, outside-click, or body-lock behavior.

Use Modal's IDs/ARIA ownership. Ensure a Command without a visible Modal.Title
has an explicit accessible label rather than a dangling `aria-labelledby`.

### Step 3: Implement one valid result-navigation model

Use `listbox`/`option` with `aria-activedescendant`, or `menu`/`menuitem` with
roving focus; do not mix models. Track an active item and support ArrowDown,
ArrowUp, Home, End, Enter, disabled-item skipping, filter-result changes, and
scroll-into-view. Escape remains owned by Modal.

### Step 4: Correct manifests and tests

Change Command's component dependency from `popover` to `modal`; remove shared
transition/overlay entries now supplied transitively; declare `fuse.js` as a
runtime peer; rebuild registry output.

Browser tests must cover overlay presence, visible panel transition parameters,
outside-click policy, focus trap/restore, body-lock cleanup on close and
destroy, controlled/bindable open, reduced motion, keyboard result navigation,
and axe with Command open.

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

- [ ] Command source contains no custom portal/backdrop/focus/body-lock code
- [ ] Command renders `data-ui="modal-overlay"` and Modal's panel motion
- [ ] Destroying an open Command restores focus and body overflow
- [ ] `bind:open` is SSR-correct and synchronized both ways
- [ ] Result roles and keyboard behavior form one valid ARIA model
- [ ] Command manifest depends on Modal and declares `fuse.js`
- [ ] All verification commands pass

## STOP conditions

- Composition requires Command to cast Modal state or depend on context order.
- Modal's new extension point permits replacing lifecycle/overlay behavior.
- Focus restoration or nested overlay behavior regresses in existing tests.

## Maintenance notes

Command may customize content layout, label, and size. Modal remains the sole
owner of modal portal, overlay, focus, dismissal, scroll lock, and motion.
