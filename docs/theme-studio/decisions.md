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

`themeToCss` emits `--floating-menu-item-*` / `--color-floating-panel*` but menu components read the non-`floating-` equivalents, so `invertedPanels` has no effect on menu item colors. **Decision (superseded by D1.2):** originally planned to repoint in Phase 1; deferred to Phase 4 where visual QA is possible. **Rationale:** least-surprise; the flag is already in the UI and presets.

## Phase 1

### D1.1 — "No hardcoded values" interpreted as theme-level, not every pixel

Tokenized values that represent a **theme decision** (padding, radius, color, timing, scalable sizes) and wired/resolved dead tokens. **Treated as acceptable component-structural constants (left as literals, listed here):** fixed overlay insets and `max-w-[25rem]` (Sheet), modal z-indices, the consistent `3px` focus-ring width, color-picker internal type sizes, avatar size variants (already variant-scoped), `ring-offset`/`ring-1` widths. **Rationale:** the thesis is "change the entire look," which is served by theme tokens — not by exposing every internal pixel as a control (which would create dead/confusing controls, violating principle #3). Exhaustive structural tokenization adds churn and control-surface noise without widening look-changes.

### D1.2 — Defer inert-flag wiring and group radius/elevation to Phase 4

`primaryButtonOutline` and `invertedPanels` are shipped flags that currently drive **no consumed token** (both half-wired). Wiring them changes colors/adds a 1px border (layout shift) and must be visually verified. **Decision:** defer both, plus per-group radius/elevation/focus-ring scales, to Phase 4 (sidebar/controls phase) where the rebuilt preview enables visual QA. **Rationale:** "no quality regressions" — wiring color-inversion or borders blind (no visual check) risks regressions; Phase 4 is the natural, safe home and pairs with new controls. The motion-curve group-scoping (cheapest, zero-visual-risk) was done in Phase 1 as the backbone demonstration.

### D1.3 — Motion-curve (easing) as the group-scoped backbone demonstration

The brief names decoupled transitions (`menu.transition` vs `panel.transition`) as the general pattern. **Decision:** Phase 1 delivers it via easing tokens decoupled from duration: added optional `hoverEasing` to `ThemeMotion`, emit `--motion-easing-hover`, wired the button through it, and made the previously-dead `--motion-panel-easing` live on the panel transition rule. Each component keeps a `var(--token, <current-curve>)` fallback so defaults are unchanged. **Rationale:** highest-value, zero-visual-risk demonstration of the group-scoped + per-component-override pattern; broader per-group scopes (radius/elevation) follow in Phase 4 with controls.

### D1.4 — Card now applies its `--card-shadow`

`card.svelte` never applied a shadow despite `--card-shadow: var(--shadow-xs)` existing. **Decision:** wired `shadow-[var(--card-shadow)]` with the existing `--shadow-xs` default (subtle elevation, on-brand; `fancyShadows=false` still flattens it). This is the token working as designed, not a regression. **Rationale:** satisfies "every existing token affects its component"; revisit in the Phase 3 preview if it reads wrong.

## Phase 2

### D2.1 — Phase 2 decomposition scope: extract the preview module; fold toolbar/inspector/dialog extraction into Phases 3–4

The Studio page (4,079 lines) was decomposed by extracting the **Playground preview** (~1,030 lines of template + its fully self-contained demo state) into `studio-preview.svelte` (page now 2,921 lines). **Decision:** the toolbar, inspector tabs, and dialogs are **not** extracted in Phase 2; that work folds into Phase 3 (preview rebuild) and Phase 4 (sidebar/toolbar rebuild), which rewrite those exact regions. **Rationale:** the preview was state-independent (referenced zero page identifiers) → a clean, zero-risk lift that also establishes the boundary Phase 3 needs. The toolbar/inspector/dialogs heavily mutate the central editor state; extracting them now requires shared-state plumbing that Phase 4's rebuild will redesign anyway — a separate extract-then-rewrite pass would be wasteful churn and added risk. Verified behavior-identical via a Playwright before/after screenshot of the live Studio.

### D2.2 — Visual verification harness

Playwright's `chrome` channel needs sudo for system deps (unavailable); installed `chromium` instead and drive it via a direct node script (`/tmp/silk-*.mjs`) against the dev server, rather than the Playwright MCP (which hard-looks for `/opt/google/chrome/chrome`). This gives a working before/after screenshot loop for the refactor/UI phases. **Note:** the `/themes/[name].css` endpoint returns 500 in this dev env — pre-existing, caused by the theme-**registry** backend not running (fails at `getRegistryThemeBySlug`, never reaches `themeToCss`); unrelated to this work and does not affect Studio rendering.
