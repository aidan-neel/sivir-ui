# Autonomous Decisions Log

Every decision made without supervision during the Theme Studio overhaul, with a one-line rationale. Newest within each phase appended over time.

## Phase 0

### D0.1 — Commit strategy given a dirty working tree

The branch `github-workflows` had **188 files / +9,291 lines** of pre-existing uncommitted WIP (a "big migration") overlapping target files (`presets.ts`, `ui.css`, many components). **Decision:** create branch `theme-studio-overhaul`; commit the pre-existing tree as one clearly-labeled snapshot (`1e77c6b`) so each phase lands as an isolated, reviewable diff on top. **Rationale:** stashing/resetting risks losing the user's work (destructive, circuit-breaker territory); a labeled snapshot commit is fully recoverable (`git reset --soft`) and loses nothing. Baseline before starting was green (typecheck 0 errors, 573 tests pass, lint 0 errors).

### D0.2 — Single source of truth = TypeScript schema, `ui.css` reduced to derivation-only

**Decision:** the editable token surface lives in the TS schema (`ThemeDraft` + resolved spacing/typography/motion/new groups), serialized by `themeToCss()`. `ui.css` keeps only (a) `var()`-derivation chains that cannot be data-driven, (b) `@layer base` rules, (c) keyframes/reduced-motion. Where `ui.css` currently holds a _default value_ for an editable token, that default migrates into the TS schema and `themeToCss` emits it. **Rationale:** eliminates the two-sources-of-truth divergence without a risky full CSS-generation rewrite; preserves the existing layered cascade.

### D0.3 — Final group taxonomy (validated against the 38-component inventory)

Adopted, with components mapped:

- **Modals:** Modal, AlertDialog.
- **Menus:** DropdownMenu, ContextMenu, Select, Combobox, Command, Popover, (HoverCard anchored).
- **Controls:** Button, Input, Textarea, Checkbox, Switch, Toggle, ToggleGroup, Slider, RadioGroup, Badge, Label.
- **Surfaces:** Card, Sheet, Accordion, Collapsible, ScrollArea, Skeleton, Separator.
- **Transient:** Toast, Tooltip, HoverCard.
- **Nav/Data:** Tabs, Breadcrumb, Pagination, Calendar, ColorPicker, Avatar, Progress, Marquee, Shortcut.

**Rationale:** matches the brief's groups; Nav/Data added because the inventory has components (Tabs, Breadcrumb, Pagination, Calendar, etc.) that fit none of the five. A component may draw from multiple groups (e.g. ColorPicker is Nav/Data + uses Menu popover tokens); non-interactive members (Badge, Separator, Skeleton) carry no state tokens. **No Table component exists** (the inventory's "Table" was a false expectation). Group-scoped token prefixes: `--modal-*`, `--menu-*`, `--control-*`, `--surface-*`, `--transient-*`, `--nav-*`, with component tokens falling back via `var(--<component>-x, var(--<group>-x))`.

### D0.4 — Scope of "make every token editable"

Not all 77 Category-B tokens become controls. **Decision:** exclude B1 runtime/mechanism vars (`--ui-*`, `--popover-available-*`, `--silk-marquee-*`); promote all B3 (genuine missing axes) and a curated B2 subset (one representative override per variant family, plus all surface/menu/transient color anchors) into the schema. **Rationale:** "a control that exists must do something" cuts both ways — exposing runtime vars as controls would create dead/confusing controls. Full per-variant color override is delivered through the existing Advanced Colors modal pattern, not the primary sidebar.

### D0.5 — Half-wired `invertedPanels` feature

`themeToCss` emits `--floating-menu-item-*` / `--color-floating-panel*` but menu components read the non-`floating-` equivalents, so `invertedPanels` has no effect on menu item colors. **Decision:** Phase 1 repoints menu/popover item consumers to the `--floating-*` tokens (via `var(--floating-x, var(--menu-x))` fallback) so the existing feature works, rather than deleting a shipped flag. **Rationale:** least-surprise; the flag is already in the UI and presets.
