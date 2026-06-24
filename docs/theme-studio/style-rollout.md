# Style Rollout Backlog

The Style mechanism (Flat / Soft / Sharp) shipped in Phase 5 is **bounded to a reference set** of 5 components, one per primary token group:

| Group     | Reference component |
| --------- | ------------------- |
| Controls  | Button              |
| Surfaces  | Card                |
| Modals    | Modal               |
| Menus     | DropdownMenu        |
| Transient | Tooltip             |

Each style is a coherent **token bundle** (`packages/silk/src/themes/styles/<slug>.ts`) that overrides _shared_ tokens (radius scale, elevation/shadow, padding) which those components consume — so a "Sharp" button matches a "Sharp" card automatically, with no per-component code. Styles are separately-installable: each is its own module, auto-registered by the glob in `styles/index.ts`, ready for the future CLI to copy a subset.

## How a style is applied

The Studio's `selectedStyleSlug` drives `styleToCss(getStyle(slug))`, appended to the generated theme CSS as a trailing `:root, .dark { … }` block so it wins the cascade in both modes. Selection lives in the Shape tab.

## Rollout to the remaining components

Because styles act through shared tokens, most components already pick up the radius/elevation/padding shifts. To make each style _first-class_ on the rest of the library:

1. **Audit per-group token coverage.** For each remaining component, list the tokens it consumes that a style should influence (e.g. `--field-*` for Input/Textarea, `--menu-*` for Select/Combobox/Command/ContextMenu/Popover, `--sheet-*`/`--accordion-*` for Surfaces, `--toast-*` for Toast, `--tabs-*`/`--calendar-*`/`--pagination-*` for Nav/Data).
2. **Extend each style's `tokens` map** to set those tokens coherently (e.g. Flat → zero all `*-shadow`; Sharp → tighten all radius-derived tokens; Soft → enlarge radius + padding).
3. **Add the component to each style's `components` array** once verified.
4. **Verify** by switching styles in the Studio Gallery screen (which already renders every group) and screenshotting.

Suggested order (highest visual impact first): Input/Textarea, Select/Combobox/Command, Sheet, Accordion, Toast, Tabs, Badge, Calendar, Pagination, the rest.

## Structural (markup) variation

A style is _primarily_ a token preset. Where a style genuinely needs markup variation (e.g. Flat dropping a highlight pseudo-element), components can branch on a `data-style` attribute. None of the reference components needed this yet — keep it the exception, not the rule.

## Deferred token directions (from Phase 4, D4.2)

These widen "change the entire look" and pair naturally with styles; add them as new token groups, then let styles set them:

- **Per-group radius scales** — `--control-radius`, `--menu-radius`, `--surface-radius`, `--modal-radius` with `var(--component, var(--group, var(--radius-*)))` fallback, so a style (or the sidebar) can round menus differently from cards.
- **Per-group elevation scales** — `--{group}-elevation` mapping to the `--shadow-*` ramp.
- **Per-group focus-ring treatment** — width/offset/color per group.
- **Density / scale tokens** — a per-group multiplier on heights/padding.
- **Border-treatment tokens** — width/style per group (hairline vs bold vs none), which the Flat style would lean on.

## Known limitation

`selectedStyleSlug` is **not persisted** across reloads (resets to Default) and is **not part of undo/redo** — deliberately, to avoid coupling into the snapshot/history machinery in this bounded phase. To persist it: add `selectedStyleSlug?: string` to `ThemeStudioState` (`themes/live.ts`) + `StudioSnapshot`, set it in `captureStudioSnapshot`/`applyStudioState`, and include it in the save `$effect`.
