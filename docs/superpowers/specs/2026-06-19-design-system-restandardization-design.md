# Silk Design System — Re-standardization Spec

**Date:** 2026-06-19
**Status:** Draft for review
**Author:** Design-system audit + re-flow

---

## 1. Problem

Silk became _too customizable_, and the result is inconsistent and visually inconsistent ("ugly"). The audit found three stacked, overlapping customization layers that fight each other:

| Layer                          | Surface                               | Location                                                   |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| Base CSS tokens                | **~280 CSS variables**                | `packages/silk/src/ui.css`                                 |
| Theme engine (`ThemeDraft`)    | **~91 fields** → ~150 emitted vars    | `packages/silk/src/themes/presets.ts`                      |
| Theme Studio UI                | **~153 user-facing knobs**            | `apps/docs/src/routes/themes/studio/+page.svelte`          |
| Presets · Styles · Transitions | 6 presets · 3 styles · 13 transitions | `themes/presets/`, `themes/styles/`, `themes/transitions/` |

### Root causes of the inconsistency

1. **Redundant, overlapping controls.** Radius can be set three independent ways (`radiusBase` math, explicit `radiusSm/Md/Lg/Xl`, _or_ a style layer). Shadows can be disabled by `fancyShadows` and re-enabled by a style. The `durationPreset` name lies the moment `motion.*` is overridden. One theme can be internally contradictory (`fancyButtons: true` + `fancyShadows: false`).
2. **No token tiering.** Component tokens (`--button-*`, `--field-*`, `--menu-*`) are hand-authored, not derived — so they drift apart over time.
3. **Component-level drift.** Only 4 of 42 components use `tailwind-variants`; the rest mix inline class-maps + raw `var()`. Hardcoded pixels everywhere (`h-[2px]`, `size-8`, `h-[148px]`). Variant taxonomies disagree (button: 10 variants; badge: 7 different ones; input: 2; alert borrows `--button-*`).
4. **Styles cover only 5 of 42 components.** Applying "Sharp" leaves 37 components untouched → guaranteed incoherence.

---

## 2. Decisions (locked)

| #   | Decision            | Choice                                                                              |
| --- | ------------------- | ----------------------------------------------------------------------------------- |
| 1   | Theme Studio's role | **Keep, but constrain hard** — ~6 high-level controls, everything else derived      |
| 2   | Default aesthetic   | **Notion-like** — neutral grayscale foundation, light-blue primary used _rarely_    |
| 3   | Token architecture  | **Strict 3-tier derivation** (primitive → semantic → component)                     |
| 4   | First deliverable   | **This full written spec** (approve before any code)                                |
| 5   | Cull scope          | **Aggressive** — delete styles layer; transitions → 4 motion levels; 6 presets → ~3 |
| 6   | Elevation           | **Borders-first, both modes** — shadows only on truly-floating layers, very soft    |

---

## 3. Aesthetic direction (the north star)

Translated from the reference screenshots (Notion-style "memd" library app, light + dark):

- **Near-monochrome.** A neutral gray ramp carries ~95% of every screen. Color is an accent, not a brand wash.
- **Light blue primary, used sparingly.** Appears only on: links, selected/checked states, focus ring, and a single primary CTA. It is _not_ sprayed across surfaces, headers, or borders.
- **Surfaces defined by borders + neutral steps, not elevation.** Light: off-white app bg, white cards, hairline borders, whisper-soft shadow on floating layers only. Dark: near-black bg, flat low-contrast surfaces, 1px borders do the separation work — **no card/panel shadows in dark mode**.
- **Quiet motion.** No inner highlights, no glossy button gradients, no haptic bounce by default. Calm, fast, unobtrusive.
- **Tight-but-breathing density.** Compact lists, generous content margins.

**Net change from today:** the _default visual language flips_ from "fancy/elevated/indigo" to "flat/bordered/neutral with a quiet blue accent." Every "fancy" mechanism is retired (see §8).

---

## 4. Token architecture (3 tiers)

### Naming convention

```
Tier 1  --silk-{scale}-{step}        primitives, brandless, mode-agnostic
Tier 2  --color-{role}, --radius-*…  semantic, mode-aware (light/dark remap)
Tier 3  --button-*, --field-*…       component, DERIVED from Tier 2 by recipe
```

Tier 2 keeps the **existing public names** (`--color-background`, `--radius-lg`, etc.) so component churn is minimized — only their _values_ change (now pointing at Tier-1 primitives). Tier 3 tokens stop being hand-authored and become formula-derived.

> **Rule:** Components may only consume Tier 2 and Tier 3. They must never reference a Tier-1 primitive directly, and never hardcode a literal value.

---

### 4.1 Tier 1 — Primitives

These are the _only_ hand-picked numbers in the system.

#### Neutral ramp (the workhorse)

A 13-step gray ramp. Cool-neutral by default (Notion leans very slightly warm-neutral; "temperature" is a Studio control — see §6).

| Step                 | Light value | Dark value | Typical role                       |
| -------------------- | ----------- | ---------- | ---------------------------------- |
| `--silk-neutral-0`   | `#ffffff`   | `#0d0d0d`  | pure base / cards (mode-dependent) |
| `--silk-neutral-25`  | `#fbfbfa`   | `#141414`  | app background (light)             |
| `--silk-neutral-50`  | `#f7f7f5`   | `#1a1a1a`  | muted surface                      |
| `--silk-neutral-100` | `#f0f0ee`   | `#212121`  | secondary surface                  |
| `--silk-neutral-150` | `#e8e8e6`   | `#282828`  | hover fill                         |
| `--silk-neutral-200` | `#e2e2df`   | `#303030`  | border                             |
| `--silk-neutral-300` | `#d4d4d0`   | `#3a3a3a`  | border-strong / input              |
| `--silk-neutral-400` | `#b4b4ae`   | `#4a4a4a`  | disabled text                      |
| `--silk-neutral-500` | `#8f8f88`   | `#6b6b6b`  | foreground-muted                   |
| `--silk-neutral-600` | `#6f6f68`   | `#8a8a8a`  | secondary text                     |
| `--silk-neutral-700` | `#52524c`   | `#a8a8a8`  | strong secondary text              |
| `--silk-neutral-800` | `#33332e`   | `#d0d0d0`  | near-foreground                    |
| `--silk-neutral-900` | `#1c1c19`   | `#ededed`  | foreground                         |

> Values above are the **starting proposal** and will be tuned for WCAG AA contrast during implementation (foreground vs background ≥ 7:1 body, ≥ 4.5:1 secondary). The dark ramp is intentionally _low-contrast between adjacent surface steps_ to match the flat reference look.

#### Accent (blue) ramp — used sparingly

| Step               | Light                    | Dark                     | Role                       |
| ------------------ | ------------------------ | ------------------------ | -------------------------- |
| `--silk-blue-50`   | `#eef4ff`                | `#13233d`                | tinted fill (selected row) |
| `--silk-blue-100`  | `#dbe8ff`                | `#1c3357`                | hover tint                 |
| `--silk-blue-500`  | `#4a8cff`                | `#5b9bff`                | **primary**                |
| `--silk-blue-600`  | `#3b7af0`                | `#4a8cff`                | primary-hover              |
| `--silk-blue-ring` | `rgb(74 140 255 / 0.40)` | `rgb(91 155 255 / 0.45)` | focus ring                 |

Light blue, deliberately soft — not Linear indigo. The current `#5e6ad2` is retired.

#### Status hues

Each is a 3-stop mini-ramp (`-fg`, base, `-tint`) for success / warning / error. Restrained, desaturated to fit the neutral system.

| Hue     | base (light) | base (dark) |
| ------- | ------------ | ----------- |
| success | `#3f9b6b`    | `#4caf7d`   |
| warning | `#c98a2b`    | `#e0a23c`   |
| error   | `#d05050`    | `#e06464`   |

(`destructive` collapses into `error` — see §7.)

#### Spacing scale (4px base)

`--silk-space-{n}` where token = `n × 4px`:

| Token             | px  |
| ----------------- | --- |
| `--silk-space-1`  | 4   |
| `--silk-space-2`  | 8   |
| `--silk-space-3`  | 12  |
| `--silk-space-4`  | 16  |
| `--silk-space-5`  | 20  |
| `--silk-space-6`  | 24  |
| `--silk-space-8`  | 32  |
| `--silk-space-10` | 40  |

All component padding/heights/gaps are expressed as multiples of this scale. The Studio "density" control multiplies the base unit (4px) — so _every_ spacing token scales coherently from one number (replaces the 39 independent spacing knobs and the lossy `scaleSpacing` rounding).

#### Radius scale

| Token         | Default | Sharp | Rounded |
| ------------- | ------- | ----- | ------- |
| `--radius-sm` | 4px     | 2px   | 6px     |
| `--radius-md` | 6px     | 3px   | 10px    |
| `--radius-lg` | 8px     | 4px   | 14px    |
| `--radius-xl` | 12px    | 6px   | 20px    |

Driven by a single Studio "radius" control (3 presets). No `radiusBase` math + explicit override duplication.

#### Type scale

| Token            | Size | Weight | Tracking | Line-height |
| ---------------- | ---- | ------ | -------- | ----------- |
| `--text-display` | 24px | 600    | -0.02em  | 1.2         |
| `--text-header`  | 18px | 600    | -0.015em | 1.3         |
| `--text-body`    | 14px | 400    | 0        | 1.5         |
| `--text-label`   | 13px | 500    | 0        | 1.4         |
| `--text-button`  | 14px | 500    | 0        | 1           |
| `--text-badge`   | 12px | 500    | 0        | 1           |
| `--text-mono`    | 13px | 400    | 0        | 1.5         |

> Body drops from today's 16px to **14px** to match the dense Notion reference. Fonts: default sans `Geist` (or Studio-selectable), mono `Geist Mono`. The 15 independent typography sliders collapse to the type scale + a font-family picker.

#### Elevation scale (borders-first)

| Token               | Light                                                            | Dark                                |
| ------------------- | ---------------------------------------------------------------- | ----------------------------------- |
| `--elevation-0`     | none (border only)                                               | none (border only)                  |
| `--elevation-1`     | `0 1px 2px rgb(0 0 0 / 0.04)`                                    | none                                |
| `--elevation-float` | `0 8px 24px -8px rgb(0 0 0 / 0.12), 0 2px 6px rgb(0 0 0 / 0.06)` | `0 12px 32px -8px rgb(0 0 0 / 0.5)` |

Cards/panels use `--elevation-0` or `1`. Only truly-floating layers (popover, modal, sheet, toast, tooltip, menus) use `--elevation-float`. **Dark mode cards/panels get no shadow** — borders only.

#### Motion scale

Four feel-levels (see §6). Each defines all duration + easing tokens together so they can't desync:

| Feel        | hover | menu  | panel | overlay | easing                          |
| ----------- | ----- | ----- | ----- | ------- | ------------------------------- |
| None        | 0     | 0     | 0     | 0       | linear                          |
| Subtle      | 100ms | 80ms  | 130ms | 90ms    | `cubic-bezier(0.25,0.1,0.25,1)` |
| **Default** | 140ms | 120ms | 180ms | 120ms   | `cubic-bezier(0.22,1,0.36,1)`   |
| Expressive  | 200ms | 160ms | 260ms | 160ms   | `cubic-bezier(0.34,1.2,0.64,1)` |

The 6 motion _shape_ knobs (panelX/Y/blur/scale/perspective/rotateX) collapse to a single small panel-entry recipe per feel. `prefers-reduced-motion` continues to zero all durations.

---

### 4.2 Tier 2 — Semantic tokens (mode-aware)

The contract components code against. ~24 tokens. Each maps to a Tier-1 step, remapped per mode.

| Token                                              | Light →                | Dark →              | Notes             |
| -------------------------------------------------- | ---------------------- | ------------------- | ----------------- |
| `--color-background`                               | neutral-25             | neutral-25          | app bg            |
| `--color-card`                                     | neutral-0              | neutral-50          | cards             |
| `--color-panel`                                    | neutral-0              | neutral-100         | floating panels   |
| `--color-muted`                                    | neutral-50             | neutral-0           | muted surface     |
| `--color-secondary`                                | neutral-100            | neutral-100         | secondary fill    |
| `--color-border`                                   | neutral-200            | neutral-200         | hairline          |
| `--color-border-strong`                            | neutral-300            | neutral-300         | emphasized        |
| `--color-input`                                    | neutral-300            | neutral-300         | field border      |
| `--color-foreground`                               | neutral-900            | neutral-900         | primary text      |
| `--color-foreground-muted`                         | neutral-500            | neutral-500         | secondary text    |
| `--color-primary`                                  | blue-500               | blue-500            | accent            |
| `--color-primary-hover`                            | blue-600               | blue-600            |                   |
| `--color-on-primary`                               | `#ffffff`              | `#ffffff`           | text on primary   |
| `--color-accent-tint`                              | blue-50                | blue-50             | selected-row fill |
| `--color-ring`                                     | blue-ring              | blue-ring           | focus             |
| `--color-success/warning/error` (+ `-fg`, `-tint`) | status hues            | status hues         | semantic only     |
| `--color-overlay`                                  | `rgb(20 20 20 / 0.20)` | `rgb(0 0 0 / 0.55)` | scrim             |
| `--color-foreground-opposite`                      | neutral-0              | neutral-900         | inverse text      |

Retired Tier-2 tokens: `--color-info` (fold into primary), `--color-alternate`, `--color-modal` (= panel), `--color-accent` (replaced by `accent-tint`), `--color-destructive` (= error), plus the `--color-field-*` family (folded into derived `--field-*`).

---

### 4.3 Tier 3 — Component tokens (derived by recipe)

Hand-authored component tokens are replaced by **deterministic recipes** over Tier-2 tokens, so a "secondary button" and a "secondary badge" are guaranteed to match. Examples:

```
/* Button — derived, no per-variant shadow soup */
--button-primary-bg:        var(--color-primary);
--button-primary-fg:        var(--color-on-primary);
--button-primary-hover-bg:  var(--color-primary-hover);
--button-secondary-bg:      var(--color-secondary);
--button-secondary-fg:      var(--color-foreground);
--button-secondary-hover-bg: var(--color-border);
--button-ghost-hover-bg:    color-mix(in srgb, var(--color-foreground) 6%, transparent);
--button-outline-border:    var(--color-border-strong);

/* Field — single source, no --color-field-* duplication */
--field-bg:          var(--color-card);
--field-border:      var(--color-input);
--field-focus-border: var(--color-primary);
--field-placeholder: var(--color-foreground-muted);

/* Menu / Card / Tooltip likewise derive from panel/border/foreground */
```

The fancy shadow / inner-highlight / haptic tokens (`--button-*-shadow`, `--button-fancy-highlight`, `--haptic-press-y`) are **deleted**, not set to `none`.

---

## 5. Unified variant taxonomy

One vocabulary, used everywhere it applies. `tailwind-variants` for **every** styled component.

### Intent variants (interactive: button, badge, etc.)

| Variant       | Meaning                                               |
| ------------- | ----------------------------------------------------- |
| `primary`     | the one accent action (blue)                          |
| `secondary`   | neutral filled (default for most)                     |
| `ghost`       | transparent, hover fill                               |
| `outline`     | bordered, transparent bg                              |
| `destructive` | error-hued (replaces today's `error` + `destructive`) |

**Retired:** `flat`, `alternate`, `success`/`warning` _as button variants_ (status colors belong to alert/badge/toast/callout semantics, not buttons).

### Status variants (semantic surfaces: alert, badge, toast, callout)

`info | success | warning | error` — driven by the status hues, never by `--button-*` tokens.

### Sizes

`sm | md | lg` (+ `icon` for icon-only). **`md` is the canonical default** everywhere (today button uses `default`, others use `md` — standardize on `md`, drop `default`).

### Component attributes (standardized)

Every interactive component sets: `data-ui="<name>"`, `data-variant`, `data-size`, `data-state`. (`data-style` is removed — the styles layer is gone.)

---

## 6. Constrained Theme Studio (~6 controls)

The ~153 knobs collapse to controls that each drive an entire Tier-1 scale. **A user physically cannot produce an inconsistent theme.**

| Control                 | Drives                                              | Options                              |
| ----------------------- | --------------------------------------------------- | ------------------------------------ |
| **Brand color**         | full blue/accent ramp (auto-generated from one hue) | color picker                         |
| **Neutral temperature** | which neutral ramp (cool / true / warm gray)        | 3 presets                            |
| **Appearance**          | light / dark / system                               | 3                                    |
| **Radius**              | entire `--radius-*` scale                           | Sharp / Default / Rounded            |
| **Density**             | the 4px base unit → all spacing                     | Compact / Default / Comfortable      |
| **Motion**              | all duration + easing + panel-entry tokens          | None / Subtle / Default / Expressive |
| **Fonts**               | `--font-sans` / `--font-mono` / `--font-header`     | family picker                        |

Removed from the Studio: 39 spacing sliders, 17 motion sliders, 15 typography sliders, 44 raw color pickers (replaced by brand+temperature derivation), all 7 "fancy/behavior" toggles, the styles selector. The "advanced/raw palette" escape hatch is removed by default (can be a hidden power-user export, out of scope here).

`themeToCss()` is rewritten to emit Tier-1 primitives + Tier-2 semantic mappings from these ~6 inputs. `ThemeDraft` shrinks from ~91 fields to ~10.

---

## 7. Per-component standardization (all 42)

Every component: (a) consumes only Tier-2/3 tokens, (b) no hardcoded literals, (c) uses `tv()` if it has variants, (d) sets standard `data-*` attributes, (e) uses the unified variant/size names.

| Component                                                                                                       | Current issue                                                                                                                                 | Action                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **button**                                                                                                      | 10 variants incl. fancy shadows/highlights, `size: default`                                                                                   | Trim to 5 intents; sizes sm/md/lg/icon; drop `before:` highlight, `--ui-button-shadow`, haptic; derive bg/fg/hover from Tier 2                                                        |
| **badge**                                                                                                       | 7 variants, borrows `--button-*`                                                                                                              | Intents (primary/secondary/ghost/outline) + status (info/success/warning/error); own derived `--badge-*`                                                                              |
| **input**                                                                                                       | only outlined/secondary, `--color-field-*`                                                                                                    | Single field recipe; variants `outline`(default)/`ghost`; sizes sm/md/lg                                                                                                              |
| **textarea**                                                                                                    | claims `primary` variant that doesn't exist                                                                                                   | Reuse field recipe; same variants as input; tokenize min-height                                                                                                                       |
| **alert**                                                                                                       | borrows `--button-*` tokens                                                                                                                   | Status variants from status hues; own `--alert-*`                                                                                                                                     |
| **checkbox**                                                                                                    | inline ternary `variant`, mixed sizing                                                                                                        | `tv()`; derive from primary/border; tokenize size                                                                                                                                     |
| **radio-group**                                                                                                 | no tokens beyond ring                                                                                                                         | Match checkbox recipe                                                                                                                                                                 |
| **switch**                                                                                                      | bespoke inline styles                                                                                                                         | Tokenize track/thumb from Tier 2; `tv()` for size                                                                                                                                     |
| **toggle / toggle-group**                                                                                       | inline `sizes` Record (hardcoded px)                                                                                                          | `tv()` sizes sm/md/lg from spacing scale                                                                                                                                              |
| **avatar**                                                                                                      | inline `sizes` Record (hardcoded px)                                                                                                          | `tv()` sizes from spacing scale; shapes circle/rounded                                                                                                                                |
| **card**                                                                                                        | ok structurally                                                                                                                               | Point to `--elevation-0/1`, `--radius-lg`, derived padding                                                                                                                            |
| **tabs**                                                                                                        | `h-[2px]` underline hardcoded                                                                                                                 | `--tabs-indicator-height` token; pill style matches reference                                                                                                                         |
| **progress**                                                                                                    | `h-2` hardcoded                                                                                                                               | `--progress-height` token                                                                                                                                                             |
| **toast**                                                                                                       | `h-[2px]` progress bar                                                                                                                        | `--toast-progress-height`; `--elevation-float`                                                                                                                                        |
| **separator**                                                                                                   | `h-px`/`w-px` literal                                                                                                                         | `--separator-thickness` (already-defined `--separator-color` unused → wire it)                                                                                                        |
| **pagination**                                                                                                  | `size-8` literal                                                                                                                              | reuse `icon` button size token                                                                                                                                                        |
| **color-picker**                                                                                                | `h-[148px]` literal                                                                                                                           | `--color-picker-area-height` token                                                                                                                                                    |
| **skeleton**                                                                                                    | inline gradient                                                                                                                               | `--skeleton-base/-highlight` (exist) — wire them                                                                                                                                      |
| **slider**                                                                                                      | bespoke webkit styles                                                                                                                         | Keep, point thumb/track at tokens (already mostly does)                                                                                                                               |
| **popover / modal / sheet / tooltip / dropdown-menu / context-menu / select / combobox / command / hover-card** | divergent padding token names (`--panel-padding` vs `--modal-padding` vs `--sheet-body-padding`), `--floating-menu-item-*` defined-but-unused | Unify on `--panel-padding` + `--menu-item-*` recipe; all floating layers use `--elevation-float`, `--color-panel`, `--radius-lg`; wire the unused floating-menu tokens or delete them |
| **accordion, collapsible, breadcrumb, calendar, label, marquee, scroll-area, shortcut, command, hover-card**    | mostly fine                                                                                                                                   | Audit for literals; point at Tier-2/3; standardize `data-*`                                                                                                                           |

A full row-per-component checklist (variants × sizes × tokens-consumed) will be generated as an appendix during implementation so each component has an explicit acceptance list.

---

## 8. Cull list (aggressive)

| Item                                                                                                                                       | Fate                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `themes/styles/` (flat, soft, sharp, index, types)                                                                                         | **Delete.** Replaced by radius + density + the flat default.                                                                                                       |
| `themes/transitions/` (13 presets)                                                                                                         | **Reduce to 4** motion-feel levels (None/Subtle/Default/Expressive) inlined in the motion scale. Delete the 13 individual files.                                   |
| `themes/presets/` (6 presets)                                                                                                              | **Collapse to ~3** (e.g. `default`, a warm/editorial, a dense/technical) regenerated from the new ~10-field `ThemeDraft`.                                          |
| Boolean flags: `fancyButtons`, `fancyBadges`, `fancyShadows`, `hapticPress`, `primaryButtonOutline`, `invertedPanels`, `overlaysOnSurface` | **Delete.** Folded into opinionated flat defaults.                                                                                                                 |
| `--button-*-shadow`, `--button-fancy-highlight`, `--haptic-press-y`, button `before:` highlight                                            | **Delete.**                                                                                                                                                        |
| `--color-field-*` family, `--color-info`, `--color-alternate`, `--color-modal`, `--color-destructive`                                      | **Delete / alias** per §4.2.                                                                                                                                       |
| 39 spacing fields, 17 motion fields, 15 typography fields in `ThemeDraft`                                                                  | **Replace** with scales driven by the ~6 Studio controls.                                                                                                          |
| Registry (`apps/registry`) publish/persist                                                                                                 | Keep the API, but persisted theme shape changes to the new ~10-field `ThemeDraft`. Migration of any existing stored themes is out of scope (regenerate built-ins). |

---

## 9. Migration / sequencing (not a plan — just dependency order)

1. Write Tier-1 primitives + Tier-2 semantic remap in `ui.css` (new values, same public names where kept).
2. Rewrite Tier-3 component tokens as derived recipes; delete fancy tokens.
3. Rewrite `themes/presets.ts`: shrink `ThemeDraft`, rewrite `themeToCss()` to emit tiers from ~6 inputs; delete `scaleSpacing` rounding path, `radiiFromBase` duplication.
4. Delete `themes/styles/`; reduce `themes/transitions/`; collapse `themes/presets/`.
5. Standardize components (§7), starting with the shared-token leaders: **button → badge → input/textarea → menu/popover family → the rest.**
6. Rebuild the constrained Studio UI (§6).
7. Update all 40 docs component pages + Studio docs to the new surface.

**Verification per step:** visual diff against the reference screenshots (light + dark), `bun run check`, and a token-lint that fails on any literal px/hex in component `.svelte`/`variants.ts` (no value outside the token system).

---

## 10. Success criteria

- One source of truth per visual property; **no property settable two ways.**
- Every component consumes only Tier-2/3 tokens; **zero hardcoded literals** (enforced by lint).
- One variant/size vocabulary across all 42 components.
- Studio cannot produce an internally inconsistent theme.
- Default theme matches the Notion-like references in both light and dark.
- `ThemeDraft` ≤ ~10 fields; CSS token count materially reduced from ~280.

---

## 11. Open questions for reviewer

1. **Default font** — keep `Geist`, or switch to an Inter/`-apple-system` stack closer to Notion? (Spec assumes Geist retained.)
2. **Body size 14px** — confirm the drop from 16px (denser, matches reference) is desired.
3. **Surviving presets** — which ~3 themes do you want kept/curated?
4. **Registry stored themes** — confirm we can discard any existing user-published themes (schema changes), or do we need a migration?
