# Silk Library — Phase 1 Audit

**Scope:** `app/src/lib/silk/` only. Theme studio and other dev-side / app code excluded. Read-only audit; no code changes.

**Purpose:** Establish a baseline before pattern guide, tests, and refactor. Designed to be portable to a third-party reviewer with no codebase access — they should be able to read this and form a second opinion.

## Revision history

- **r1**: initial audit.
- **r2**: distribution model clarified — silk ships via a CLI that auto-pulls component dependencies from a per-component manifest (shadcn-style). Conflicts don't overwrite without `--overwrite`. Added dependency graph (§2), corrected three factual errors from r1, added F-29–F-32, adjusted scorecard.
- **r4**: shipping-quality fixes from reviewer feedback on r3:
  - Deleted the duplicated §3 Rubric (r3 added the new rubric without removing the old one).
  - Neutralized F-31's "recommended" framing; the recommendation now sits on a clearly labeled author-opinion line, not embedded in the comparison table.
  - Added F-2 timing note distinguishing Phase 1.5 design (format spec) from later implementation (writing 42 manifests + CLI integration).
  - Added a scorecard footnote making explicit that Structural cohesion is a measurement change (new dimension, not previously scored), not a finding change — the underlying evidence existed in r2.
  - Added §8 question 7: button-specific decisions (onhover naming, ButtonState fate, element type union split) — these were called out in §2.1 but never made into reviewer questions.
  - Added §8 question 8: diamond dedup behavior — how should the CLI handle the popover-wrapper → popover/button + popover → button pattern?
- **r3**: response to reviewer feedback on r2. Changes:
  - Promoted the parallel-implementation findings (F-29, F-30) into a new **"Headline findings"** subsection at the top of §5 — they were buried.
  - Added a new scorecard dimension, **Structural cohesion**, to hold "parallel implementations of the same primitive" — these don't fit cleanly under API stability or Internal consistency. Re-scored with the expanded rubric.
  - **Corrected scorecard rationale**: the "manifest format not defined" impact moves from Documentation (r2 had it there) to API stability — it's an API definition gap, not a documentation gap. Documentation restored to evidence-based score.
  - Expanded F-31 from "policy needed" to three concrete options with tradeoffs.
  - Added a **button-as-hub** paragraph to §2.1 — fan-in ~12 is the largest blast radius in silk and was not called out as a primary concern.
  - Added explicit commitment to SSR and a11y assessment in Phase 2 (§7) — these are required public contracts for a CLI-distributed UI library, not optional dimensions.
  - Added a **methodology note** at the end of revision history explaining how r1's three factual errors were possible, and what r2/r3 changed.

### Methodology note (how r1 got three things wrong)

r1 leaned heavily on a subagent's narrative inventory ("alert-dialog → modal (delegation)" type prose) that mixed structural facts with behavioral inference. Where the subagent inferred a wrapper relationship from naming and prop similarity (sheet/tooltip/hover-card all look like they should wrap modal/popover), it asserted the relationship as fact without grep-verifying the actual imports. This produced three wrong claims in r1 that survived into the scorecard reasoning.

r2 added a grep-verified component-to-component import sweep (now in §2) and caught all three. r3 makes that the standing convention: **import-graph facts are grep-verified before they enter the audit.** Behavioral inferences ("X likely uses Y", "X seems to wrap Y") are not facts and don't appear in flagged items unless verified at the file level. The dependency graph in §2 is the canonical source for structural relationships.

Going forward, structural duplication is also harder to miss because it shows up in the dependency graph by absence — `sheet/sheet.svelte` having no `import * as Modal` is now a visible fact, not an oversight. A reviewer can spot-check by running the grep command quoted in §2.

**Caveats for the reviewer:**
- Architectural/consistency/API-surface issues only. Lint-level nitpicks are excluded by design.
- I (the author) am one signal. The point of this document is to invite disagreement.
- Scores reflect _the rubric below_, not a vibe check. Disagree with the score by disagreeing with the rubric application.

---

## 1. What Silk is

Silk is a Svelte 5 component library at `app/src/lib/silk/`:

- **42 components** under `components/` (accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, checkbox, collapsible, color-picker, combobox, command, context-menu, dialog, dropdown-menu, hover-card, input, label, marquee, modal, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, shortcut, skeleton, slider, switch, tabs, textarea, toast, toggle, toggle-group, tooltip).
- **~136 Svelte files, ~67 TS files.**
- **Supporting infra:** `utils.ts` (175 lines — `cn()`, focus/click-outside/floating helpers), `internals/state.svelte.ts` (31 lines — `UIState`/`useState`/global `states` registry), `internals/transition.ts` (267 lines — themed transitions), `themes/` (presets + live theming + transition presets + CSS generation), `ui.css` (445 lines — design tokens, `@theme` block, dark override).
- **No top-level `index.ts`.** Consumers import via subpaths: `$lib/silk/components/button`, `$lib/silk/utils`, etc.
- **Distribution model: CLI auto-pull (shadcn-style).** Components are not consumed via package imports; a CLI reads a per-component manifest, copies the component's files into a consumer project, and recursively installs any components/utilities the manifest declares as dependencies. Conflicts do not overwrite existing files unless `--overwrite` is passed. This means the **dependency manifest is part of the public API contract** — adding a dep is non-breaking, but removing one orphans the primitive in consumer projects and is breaking. `app/package.json` marks the parent as `"private": true` with no `exports` field, which is consistent with this model (silk is not a published package).
- **Fully migrated to Svelte 5.** No Svelte 4 syntax (`<slot>`, `on:click`) remains. Snippets and `onclick` throughout.
- **Zero `bits-ui` imports.** Every primitive is hand-written.
- **`internals/` is internal in name only** — `flyAndScale` is imported by `app/src/lib/components/docs/component-preview.svelte` from outside silk. This is the only external leak from `internals/`.

### Dependency hubs (refactor-impact map)

| Primitive | Wrapped/extended by | Impact of changing its public surface |
|---|---|---|
| `modal` | `dialog`, `alert-dialog`, `sheet` | 3 components break |
| `popover` | `combobox`, `command`, `context-menu`, `dropdown-menu`, `select`, `color-picker`, `hover-card`, `tooltip` (likely) | 6–8 components break |
| `button` | Every component with a trigger (alert-dialog-trigger, dialog-trigger, modal-trigger, popover-trigger, sheet-trigger, dropdown-menu-trigger, …) | API change touches ~10 trigger components |
| `useState`/`UIState` (`internals/state.svelte.ts`) | 16+ components instantiate, 50+ read via `states[key]` | Signature change is global |

---

## 2. Dependency graph (component → component)

Built from `grep -rn "from '\$lib/silk/components/" --include='*.svelte' --include='*.ts'` across `app/src/lib/silk/components/`. Edges are direct file-to-file imports; transitive deps not shown unless noted.

### 2.1 Hub fan-in (direct imports only)

| Hub | Auto-pulled by | Count |
|---|---|---|
| `button` | `alert-dialog`, `dialog`, `combobox`, `command`, `context-menu`, `dropdown-menu`, `select`, `modal` (trigger/close/confirm), `popover` (trigger), `sheet` (trigger/footer/header/close), `toast` | **~12** (universal interactive base) |
| `popover` | `combobox`, `command`, `context-menu`, `dropdown-menu`, `select`, `color-picker` (+ `dropdown-menu-item` imports `PopoverState` type) | **6** |
| `modal` | `alert-dialog`, `dialog` | **2** |
| `input` (variants only) | `textarea` (imports `input/variants` not the full component) | **1, partial** |

`button` and `popover` are the structural load-bearing primitives. A change to either of their public surfaces propagates to every consumer that auto-pulled them — without any consumer opting in to the change.

#### `button` as the highest-blast-radius surface

Fan-in of ~12 makes `button` the largest blast-radius surface in silk. Every component that has an interactive trigger (modal, dialog, alert-dialog, popover, sheet, dropdown-menu, combobox, command, context-menu, select, color-picker indirectly, toast) auto-pulls it. Its current public API (`button/index.ts:5-26`):

- **10 variants:** `primary`, `success`, `warning`, `error`, `flat`, `outlined`, `secondary`, `ghost`, `alternate`, `destructive`.
- **4 sizes:** `sm`, `default`, `lg`, `icon`.
- **Dual-mode:** renders as `<button>` or `<a>` based on `href` (`button.svelte:37-80`).
- **Bindable element** typed as `HTMLButtonElement | HTMLAnchorElement | undefined`.
- **Three custom callbacks:** `onhover`, `onhoverend`, `onclick` — `onhover/onhoverend` are silk-specific naming, not DOM-standard (`pointerenter/leave`).
- **Spread attributes:** `Partial<HTMLButtonAttributes | HTMLAnchorAttributes>` — union of two attribute sets.
- **Vestigial `ButtonState`:** declared (`button/index.ts:28-30`) containing only `onclick`, barely used internally.

Stability assessment:

- ✅ **Additive growth is safe.** New variants and sizes are non-breaking under the auto-pull model.
- ⚠️ **Variant renames are breaking** for every consumer (10 variants × ~12 dependents = 120 potential update sites if names change).
- ⚠️ **The `onhover`/`onhoverend` naming is non-standard.** If silk later wants to align with DOM events (`onpointerenter` / `onpointerleave`), that's a breaking rename across every trigger.
- ⚠️ **Bindable `element` union type** forces consumers to narrow on use. A trigger that only ever renders a `<button>` still has to handle the anchor case in types.
- ⚠️ **`ButtonState`** is declared but barely used. Either build out the state model or remove it — currently neither carries weight.
- 🔴 **Manifest impact:** any change to button's public types touches the manifest of every dependent. Under semver (F-32), most changes here would be majors. **`button` should be the most carefully versioned component in the library, and its API should be locked down first.**

Recommendation for Phase 4: treat `button` as a stability anchor. Resolve the `onhover`/`onhoverend` naming question and the `ButtonState` vestigial type before any other Phase 4 refactor — these are the cheapest fixes that prevent the largest cascade.

### 2.2 Wrappers and what they pull

| Wrapper | Direct deps (auto-pulled) | Transitive deps (also installed) |
|---|---|---|
| `alert-dialog` | `modal`, `button` | `button` (already direct) |
| `dialog` | `modal`, `button` | `button` (already direct) |
| `combobox` | `popover`, `button` | `button` via `popover-trigger` |
| `command` | `popover`, `button` | `button` via `popover-trigger` |
| `context-menu` | `popover`, `button` | `button` via `popover-trigger` |
| `dropdown-menu` | `popover`, `button` | `button` via `popover-trigger` |
| `select` | `popover`, `button` | `button` via `popover-trigger` |
| `color-picker` | `popover` only | `button` via `popover-trigger` |
| `toast` | `button` | — |
| `textarea` | `input/variants` (partial) | — |

### 2.3 Standalone primitives (do NOT wrap anything)

- `tooltip` — has its own context, delay/closeDelay, getter-pattern state proxy. Does **not** use `popover` despite covering the same conceptual ground.
- `hover-card` — has its own `useState`, `openDelay`/`closeDelay`, `openTimer`/`closeTimer`. Does **not** use `popover`.
- `sheet` — has its own state, animation, click-outside, focus trap, `visible` flag for outro animation. Does **not** use `modal`.

These three are the surprising findings of this graph (see F-29, F-30).

### 2.4 Diamonds

Every popover-wrapper depends on both `popover` and `button` directly, while `popover` itself transitively pulls `button` via `popover-trigger.svelte:2`. So:

```
combobox ──→ popover ──→ button
   └────────────────────→ button
```

This is a benign diamond (same destination), but the manifest will list `button` twice — once directly, once via transitive resolution. The CLI's dedup behavior needs to be specified.

### 2.5 Cycles

**None detected.** `button` is a true leaf (imports only `utils.cn` and `internals/state.useState`). `modal` and `popover` are leaf-adjacent (each pulls `button` only via its `*-trigger.svelte`). No back-edges from `button` to higher-level components.

### 2.6 Parallel implementations (architectural duplication)

Two duplications discovered from the graph:

| Conceptual surface | Implementations | Differentiation |
|---|---|---|
| "Modal-like overlay" (portal, click-outside, focus trap, mount/unmount) | `modal/modal-content.svelte`, `sheet/sheet-content.svelte` | Sheet adds side-slide animation and a `visible` flag for the outro; otherwise duplicates concerns. |
| "Floating element with hover-delay" | `popover` (with `hoverable: true`), `tooltip`, `hover-card` | Three different state models. Popover uses the global registry; tooltip uses a getter-proxied local `$state`; hover-card uses `useState` with extra `openTimer`/`closeTimer` fields. |

Under the auto-pull model, these parallel implementations mean every consumer of a wrapper carries the implementation choice of whichever primitive they happened to install — they can't share fixes or features.

### 2.7 Internals-via-utils boundary

- `hover-card-content.svelte:5` imports `flyAndScale` from `internals/transition` — fine, it's inside silk.
- `app/src/lib/components/docs/component-preview.svelte` (outside silk) also imports `flyAndScale` — this is the genuine external leak from `internals/` documented in F-6.
- `utils.ts` exports `positionFloatingPanel` which is used by 3 component files. So `utils.ts` is part of the public surface that the manifest must reference, not just a free-floating helper file.

### 2.8 Implications for the pattern guide (deferred to Phase 1.5)

The graph forces several decisions:

1. **Primitive vs. wrapper policy.** When does a component justify wrapping a primitive vs. living standalone? Tooltip/hover-card/sheet all answer "standalone" right now — that may be right or wrong, but it isn't a stated convention.
2. **Manifest semver policy.** What counts as a breaking change to a primitive's manifest? Adding optional props? Adding required deps? Renaming exports? The auto-pull model requires this to be explicit (see F-32).
3. **Partial-import policy.** `textarea` imports only `input/variants` — does the manifest list `input` as a dep (overkill, pulls the full component) or `input/variants` as a sub-target (requires file-level manifest granularity)?
4. **Primitive minimum-API rule.** Under auto-pull, every wrapper's consumer inherits the primitive's full surface. So primitives should expose the minimum coherent API needed by their wrappers (see F-4).

---

## 3. Rubric

Each dimension is scored 0–100. "100" means:

| Dimension | "100" means |
|---|---|
| **API stability & clarity** | Every public export has a stable, documented contract; no ambiguous overloads; no internal leakage; props/slots/events follow one convention; rename/removal is a deliberate major-version event. Under the auto-pull model: the dependency manifest is defined as a versioned contract with explicit semver policy. |
| **Structural cohesion** *(new in r3)* | No parallel implementations of the same conceptual primitive. Each architectural concern (overlay, focus trap, floating positioning, hover-delay state, variant authoring) has exactly one owner in the library, used consistently by every component that needs it. No diamonds in the dependency graph that represent duplicated implementation rather than benign re-use. The library is composed of primitives that compose, not primitives that overlap. |
| **Internal consistency** | One way to do each thing across components: naming (file, prop, variant, event), file layout, import order, variant authoring, export pattern. A new contributor can predict the shape of an unseen component. |
| **Type safety & correctness** | No `any` outside justified escape hatches; generics propagate; props inferred at call sites; no `as` hiding bugs; discriminated unions where they belong. |
| **Error handling robustness** | Boundary errors (input, async, external state) handled at the right layer; no swallowed catches; no defensive try/catch around impossible scenarios; failure modes documented. |
| **Test coverage of critical paths** | Every critical-tier surface (per the upcoming test strategy) has a test pinned to its stable boundary; tests fail on behavior regressions, not on internal shifts. |
| **Documentation adequacy** | Public API has docstrings; README explains install/usage/theming; non-obvious decisions have "why" comments. Manifest format and semver policy live in API definition, not here — Documentation scores reflect whether what *does* exist is documented, not whether the API itself is fully defined. |
| **Refactor risk** | Internal change touches one file; renames propagate via types not search-and-replace; no circular deps; no component reaches across more than one layer. Under the auto-pull model: hub components have low fan-in or stable, minimal APIs. |

**Why "Structural cohesion" as its own dimension:** reviewer correctly noted that parallel implementations (sheet/modal, popover/tooltip/hover-card) don't fit cleanly under API stability (the APIs of each are individually fine) or Internal consistency (the inconsistency isn't in naming or conventions, it's in *architecture*). The right home for "are the building blocks the right shape" is its own dimension. This also gives the auto-pull model a clean place to score "does the library compose, or does it duplicate?" — the question that matters most under manifest-driven distribution.

---

## 4. Scorecard (Phase 1 baseline, r3)

| Dimension | r1 → r2 → r3 | Justification |
|---|---|---|
| **API stability & clarity** | **42 → 38 → 32** | r3 widens the gap: this dimension now also absorbs the "manifest format not defined" impact that r2 wrongly parked under Documentation. Concretely: no manifest format defined (F-2, F-32); no semver policy for component versioning under auto-pull; `popover` exposes three open-state modes forced on every wrapper consumer (F-4, urgent under fan-in 6); `button` API (fan-in ~12) has unresolved naming questions (`onhover`/`onhoverend` non-DOM-standard) and a vestigial `ButtonState` type — see §2.1 hub paragraph; `dialog` vs. `modal` differentiation question (F-3) still open; `internals/` leaks externally (F-6); `state_key` snake_case mixed with camelCase (F-5). |
| **Structural cohesion** *(new in r3)* | **— → — → 36** | Three parallel implementations of "floating element with hover-delay" (popover + tooltip + hover-card, F-29); two parallel implementations of "modal-like overlay" (modal + sheet, F-30); variant authoring split three ways across 42 components (F-13); state management split four ways with no decision rule (F-9); partial-component edge `textarea → input/variants` indicating shared variant authoring is undecided (F-31). The library has working pieces but they don't compose cleanly — the same architectural concern is solved 2–3 times in different files. Score of 36 reflects that the duplication is concentrated in 5 known clusters rather than rampant across all 42 components. |
| **Internal consistency** | **48 → 48 → 48** | Unchanged. Variant authoring split (4/42 use CVA, rest inline), `DefaultProps` redeclared inline in some components, four state-management approaches with no decision rule. File naming and event-callback naming remain consistent. The architectural duplications that r2 partly attributed here have moved to Structural cohesion. |
| **Type safety & correctness** | **66 → 66 → 66** | Unchanged. Only 2 type assertions in the entire library (excellent); but the `states` global registry is runtime-typed (`states[key] as UIState<X>` everywhere); 8+ `svelte-ignore state_referenced_locally` suppressions. |
| **Error handling robustness** | **55 → 55 → 55** | Unchanged. Defensive guards inconsistent in toast (`toast.dismiss()` missing the guard); hardcoded duration fallbacks; per-component cleanup is by-convention not by-structure. |
| **Test coverage of critical paths** | **3 → 3 → 3** | Unchanged. No tests. |
| **Documentation adequacy** | **22 → 18 → 22** | **Restored to r1 score.** r2 wrongly debited this dimension for the missing manifest format — that's an API definition gap, not a doc gap (reviewer correctly called this out). The actual doc evidence: `README.md` is 18 lines and folder-only; `utils.ts` and `internals/state.svelte.ts` have brief docstrings on exported functions; ~3 of 42 components have justified "why" comments; the other 39 have no prop docstrings. That's the same evidence that produced 22 in r1, and the score is the same. |
| **Refactor risk** | **38 → 38 → 38** | Unchanged. `popover` fan-in 6 with three state modes; `button` fan-in ~12 with wide variant set; `modal` fan-in 2 with parallel `sheet` competitor; `useState`/`states` global across 16+ consumers; no cycles, clean structure mitigate. |

**Two dimensions moved in r3** (API stability, Structural cohesion), **one dimension corrected back** (Documentation), five held. Total score movement r1→r3 across the 7 r1-comparable dimensions: API stability -10, Documentation 0 (after correction), all others 0. The new dimension (Structural cohesion) adds a score (36) that didn't exist in r1.

> **Structural cohesion is a measurement change, not a finding change.** The parallel-implementation evidence (sheet/modal, popover/tooltip/hover-card, variant split) was *already in the audit* by r2 — what r3 adds is a scoring home for it. Phase 5's re-score will compare r3 → r3' using the same rubric; comparing r1 to r3 directly is apples-to-oranges on this dimension. The "—" cells for r1/r2 reflect "not measured then," not "scored 0."

**No averaged total.** Each dimension is independently auditable.

---

## 5. Flagged items

Format: `file:line` · smell (1–2 sentences) · why it's a problem · suggested direction (not a fix). Grouped by theme, not by file, so the third-party reviewer can spot patterns rather than scrolling component-by-component.

### 5.0 Headline findings (read these first)

These three items are the largest structural concerns in the library. They drive the Structural cohesion score, frame the primitive-vs-wrapper question for Phase 1.5, and constrain what Phase 4 has to resolve. Everything else in §5 is downstream of these.

**F-29 · Three parallel implementations of "floating element with hover-delay".** `popover` (with `hoverable: true`, `delay`, `closeDelay`, registered in the global `states` registry), `tooltip` (standalone, with `delay`/`closeDelay` props and a getter-proxied local `$state`), and `hover-card` (standalone, with `useState`-backed `openDelay`/`closeDelay`/`openTimer`/`closeTimer`). Three different state models for the same conceptual primitive — same problem solved three times in three different files with no shared code path. Under the auto-pull model, a consumer can install all three and get three different implementations of essentially the same thing; a fix in one doesn't propagate to the others. _Direction:_ Phase 1.5 must answer "primitive vs. wrapper" for these three. Plausible resolutions: (a) collapse `tooltip` and `hover-card` to be popover wrappers (smaller surface, shared fixes); (b) keep them independent but unify the state model (one of: `useState`, the getter-proxy pattern, or component-local `$state` with context — see F-10 for the larger state-pattern question); (c) explicitly justify three implementations and document the per-component reason in the pattern guide.

**F-30 · Two parallel implementations of "modal-like overlay".** `modal/modal-content.svelte` portals to `<body>`, applies `clickOutside` + `trapFocus` utilities, handles click-outside-to-close and Escape-to-close, manages `document.body.style.overflow`. `sheet/sheet-content.svelte` does the same set of things — click-outside, trap focus, mount/unmount, overflow management — but with side-slide animation and a `visible` outro flag, and without portaling. The differentiating concern is the animation surface; the rest is duplicated implementation. Under auto-pull, a focus-trap bug fixed in modal stays broken in sheet. _Direction:_ extract an overlay primitive (portal + focus trap + click-outside + Escape + body-overflow management) and have `modal-content` and `sheet-content` both consume it as a dependency, with their own animation layers on top. This is a Phase 4 task once Phase 3 tests pin the overlay behavior.

**F-32 · No semver policy for the dependency manifest.** Under the auto-pull model, the manifest is the API contract. Currently undefined: (a) does adding a required prop break the manifest? (b) does adding a new auto-pulled dep break consumers who already installed the primitive standalone? (c) does renaming an exported symbol require a manifest version bump? (d) does the CLI track which version of each component a consumer has installed, and warn on drift? Without explicit answers, manifest changes will silently break consumers in ways that won't surface until the next CLI run. _Direction:_ Phase 1.5 pattern guide must define what counts as breaking for the manifest, and whether components are versioned individually or as a library-wide release.

The rest of §5 is conventional API/state/styling/documentation flags. F-29, F-30, and F-32 are the load-bearing items — engage with them first.

### 5.1 API surface

**F-1 · No top-level barrel.** `app/src/lib/silk/` has no `index.ts`. Consumers do `import { Root } from '$lib/silk/components/button'`. Under the auto-pull model this is intentional (the CLI installs files, not module imports), but the per-component public surface (`index.ts` files) is the contract that the manifest must reference. _Direction:_ document the per-component `index.ts` as the canonical surface; make it the only file the manifest exposes for each component.

**F-2 · No dependency manifest yet.** Under the auto-pull model, each component needs a manifest declaring (a) its files, (b) its component dependencies (to auto-pull), (c) its utility dependencies (`utils.cn`, `internals/state.useState`, etc.), and (d) its peer dependencies (`@floating-ui/dom`, `tailwind-variants`, `@lucide/svelte`, `clsx`, `tailwind-merge`). None of this exists today. **Timing:** the manifest format is a *Phase 1.5 design decision* (what fields, what semantics, how versioned). Generating manifests for all 42 components, wiring them into the CLI, and enforcing them in CI is *Phase 1.5+ implementation* — likely its own phase between 1.5 and 2, or absorbed into Phase 4 if the CLI exists independently. The audit assumes 1.5 produces a spec that future implementation phases follow, not 42 hand-written manifests. _Direction:_ specify the manifest format (likely JSON or TS exporting a typed object) as part of Phase 1.5; the manifest is the auditable API contract under this distribution model. See F-32 for semver policy.

**F-3 · `alert-dialog` and `dialog` wrap `modal`; `sheet` does NOT.** Confirmed by graph (§2): `dialog/dialog.svelte:1-7` and `alert-dialog/alert-dialog.svelte:1-11` both `import * as Modal`. `sheet/sheet.svelte:1-31` is a parallel implementation (its own state, sync, portal-less overlay). Under auto-pull, installing `dialog` pulls `modal` whether the consumer asked or not — so the wrapping pattern needs to justify itself per wrapper, or collapse. The current shape (`dialog` is essentially an alias for `modal`; `alert-dialog` adds role/radius only) doesn't justify the extra surface. _Direction:_ (a) collapse `dialog` into `modal` (with `dialog` becoming a documented usage example), (b) push role and radius differences into modal as variants, OR (c) keep them and document the rationale per wrapper in the pattern guide. Separately, decide whether `sheet` should share `modal`'s overlay primitive (see F-30).

**F-4 · Popover's three open-state modes are now urgent.** `popover/index.ts:24-33` accepts `open` (bindable), `state_key` (string), and `state` (full `UIState<PopoverState>` object); `popover.svelte:36-40` picks one via fallback chain. Under the auto-pull model, all 6 popover consumers (combobox, command, context-menu, dropdown-menu, select, color-picker) inherit this surface — even though they need at most one of the three modes. **Primitives must expose the minimum coherent API, not the union of every wrapper's needs.** _Direction:_ pick one canonical mode (likely `open` bindable for the simple case; if external state is needed, document the wrapper-only mode as private convention). Remove the other two from the public surface in Phase 4. This is the single highest-leverage API cleanup in the library.

**F-5 · `state_key` is snake_case; everything else is camelCase.** `popover/index.ts:28` `state_key?: string`. Adjacent props are `stateName`, `closeDelay`. _Direction:_ rename to `stateKey` if the prop is kept; remove if F-4 collapses the modes.

**F-6 · `internals/` is not internal.** `internals/transition.ts` `flyAndScale` is imported by `app/src/lib/components/docs/component-preview.svelte` — code outside silk. Either internals isn't internal, or the docs site is reaching past the library's privacy boundary. _Direction:_ either promote `flyAndScale` to public API (move out of `internals/` or re-export from a public module) or have docs use the public transition API.

**F-7 · `useState` accepts a random key by default.** `internals/state.svelte.ts:22` `key: string = Math.random().toString(36).substring(2)`. Components that don't supply a key get a non-deterministic state slot. Combined with context-based key propagation, this is hard to debug (you can't grep for the key). _Direction:_ require keys explicitly, or namespace them with a `useNew()` helper that makes "I want a fresh one" explicit and traceable.

### 5.2 State management

**F-8 · Bidirectional sync expressed as two effects + a flag.** `modal.svelte:14-26` and `popover.svelte:69-87` both use the same pattern: two `$effect` blocks plus a `syncedOpen` intermediate to sync external `open` with `uiState.data.open`. This is a Svelte 5 anti-pattern — bidirectional bindings shouldn't be expressed as two effects with manual cycle-breaking flags. _Direction:_ make `open` a `bindable` getter/setter on the state, or use a single `$derived` per direction.

**F-9 · 8+ `svelte-ignore state_referenced_locally` suppressions.** Found across `button.svelte`, `color-picker.svelte`, `combobox.svelte`, `modal.svelte`, `popover.svelte:21,38,43`, `switch.svelte`, `tabs.svelte`, `toast.svelte`. Each is a smell that the global-registry-via-context-key pattern fights Svelte's reactivity. _Direction:_ this is the design-level issue. Decide whether `useState`/`states` is the right primitive or whether component-local `$state` + context-passed getters (the pattern `accordion-item.svelte:9-12` uses well) is the better default.

**F-10 · Global `states` registry is reactive and module-scoped.** `internals/state.svelte.ts:30` `export const states = $state<Record<string, UIState<UIStateShape>>>({})`. This is a single mutable reactive Map for the whole app. Cleanup is voluntary per-component. Memory-leak surface is non-trivial; debugging cross-component coupling means tracing string keys. _Direction:_ if the registry is kept, document the lifecycle contract; if not, move to component-local state with explicit context-passed accessors.

**F-11 · `states[key] as UIState<XState>` everywhere.** The `states` map is typed `Record<string, UIState<UIStateShape>>`. Every consumer (`modal-content.svelte:20`, etc.) casts at the read site. The cast is _almost_ never wrong, but it's structurally a runtime-erased type contract — `as` is hiding work that should be in the type. _Direction:_ if `states` stays, add a typed `useStateOfShape<T>(key)` accessor that owns the cast in one place.

**F-12 · Toast singleton uses a magic-string key.** `toast/lib.svelte.ts:61` `new UIState<ToastUIState>({ toasts: [] }, 'toast')`. The string `'toast'` is unenforced — if any component uses `'toast'` as its key, they collide. _Direction:_ use a Symbol or a typed namespace; the file already uses `STATE_KEY = Symbol('TOAST')` at line 4 for context, so the inconsistency is internal to this file.

### 5.3 Variant / styling system

**F-13 · Variant authoring splits three ways.** 4 components use CVA via a `variants.ts` (`alert`, `badge`, `button`, `input`). 38 components express variants as inline conditional Tailwind in their `.svelte` files, sometimes via template literals (`checkbox.svelte:28-29`), sometimes via `style:` props with embedded CSS strings (`switch.svelte:59-67`). _Direction:_ pick one. CVA scales better for multi-variant components; inline is fine for single-variant or trivial cases. The decision rule needs to be in the pattern guide.

**F-14 · Switch puts CSS transitions in JS strings.** `switch.svelte:23-30` defines `trackTransition` and `thumbTransition` as JS template literals containing CSS. They're applied via `style:transition={trackTransition}`. This makes the transition non-themable (consumers can't override via CSS), non-cascadable, and unscannable by Tailwind. _Direction:_ move to a CSS file or a CVA variant that emits a `transition-[...]` class.

**F-15 · Inline `color-mix(...)` in components, not tokens.** `switch.svelte:63-64`, `button/variants.ts:8`, others. These computed colors aren't in `ui.css`, so consumers can't override them via theme. _Direction:_ promote to tokens (e.g., `--switch-track-active-border`) so the theme system can reach them.

**F-16 · `ui.css` has 38 sizing tokens and rapid token sprawl.** `--toggle-padding-sm/md/lg`, `--tabs-trigger-padding-x/y`, `--menu-search-padding`, etc. Without auditing every usage, this looks like component-by-component additions where each new component declared its own tokens rather than reusing a smaller core. _Direction:_ inventory unused tokens (Phase 4 task); collapse to a smaller, semantic set if possible.

### 5.4 Documentation

**F-17 · `README.md` is 18 lines, folder description only.** `silk/README.md`. No install, no usage example, no theming, no public-API list. _Direction:_ once the pattern guide exists, the README should point to it and to a minimal usage example.

**F-18 · ~39 of 42 components have zero prop docstrings.** Spot-checked: `button/variants.ts` has no prop documentation, `popover/index.ts:24-33` has no JSDoc on `PopoverProps`, etc. _Direction:_ add docstrings to public types as part of the pattern guide rollout, prioritizing the dependency hubs (`button`, `modal`, `popover`).

**F-19 · Good "why" comments exist and should be the template.** `accordion-item.svelte:7-8` explains the getter pattern; `modal-content.svelte:26-27` explains the portal. These are the right kind of comment — explaining a non-obvious decision, not narrating code. _Direction:_ the pattern guide should hold these up as exemplars.

### 5.5 Dead / unused code

**F-20 · `focusFirstDescendant` in `utils.ts:51-56` is unused externally.** Only called from within `trapFocus` in the same file. _Direction:_ unexport (move to module-private).

**F-21 · `positionFloatingPanel` is used (correction from r1).** r1 reported zero callers; correct count is three: `popover-content.svelte:101`, `popover-trigger.svelte:41`, `hover-card-content.svelte:27`. The item is no longer "dead code" — but it IS the canonical floating-positioning helper used by exactly the floating components, which makes it a public surface concern. The auto-pull manifest for `popover` and `hover-card` must list `utils.positionFloatingPanel` (and its `@floating-ui/dom` peer dep) as a dependency. _Direction:_ promote `positionFloatingPanel` to a documented public utility; ensure all floating components use it instead of calling `@floating-ui/dom` directly.

**F-22 · `color-picker.svelte:19` has a `@deprecated no-op` prop.** `showSelect` is documented as deprecated and does nothing. _Direction:_ remove, or document the deprecation timeline in the pattern guide.

### 5.6 Smaller-but-notable structural facts

**F-23 · `checkbox.svelte` redeclares props instead of using `DefaultProps`.** Line 14-21 inlines `{ checked, label, description, ..., class?: string }` rather than spreading `DefaultProps`. Inconsistent with most other components. _Direction:_ pattern guide should mandate `DefaultProps` as the base.

**F-24 · `checkbox.svelte:28-29` uses long template-literal class strings.** Multiple ternaries inside a single template literal. Hard to read, hard to diff, and would benefit from CVA or a small extract. _Direction:_ candidate for CVA migration in Phase 4.

**F-25 · Toast hardcodes durations.** `toast/lib.svelte.ts:7` `TOAST_EXIT_DURATION = 340`, `:102` fallback 5600, `:113` fallback 4200. Not linked to motion tokens (`--motion-duration-toast-in/out` exist in `ui.css`). _Direction:_ read duration from CSS vars via `getCssDuration` (which already exists in `internals/transition.ts:1`).

**F-26 · `toast.dismiss()` missing `data` guard.** `toast/lib.svelte.ts:238` reads `toastUIState.data.toasts` without `if (!data) return`. Other toast methods guard. _Direction:_ add the guard for consistency.

**F-27 · `accordion-item.svelte` getter pattern is undocumented as a convention.** Lines 9-12 expose reactive `value`/`disabled` to children via getters in a context object. This is a clean Svelte 5 pattern but it's used here and arguably nowhere else (most components use `useState` instead). _Direction:_ if this pattern is preferred for prop-passing contexts, the pattern guide should say so.

**F-28 · `tabs-trigger.svelte:10-18` ID generation is per-component.** Generates deterministic IDs from value. Similar problem exists in modal (`panelIdPrefix` + `uiState.key`), alert-dialog (overrides `panelIdPrefix`). _Direction:_ if these patterns can converge on one ID-generation helper, do that in Phase 4.

### 5.7 Architecture (continued)

F-29, F-30, and F-32 are above in §5.0 (Headline findings). F-31 expands here because it's a smaller-scope architectural decision that doesn't need top-of-document attention but does need explicit options spelled out for Phase 1.5.

**F-31 · Partial-component dependency edge: `textarea` → `input/variants`.** `textarea.svelte:5` imports specifically `$lib/silk/components/input/variants`, not the input component itself. Under auto-pull, the manifest needs a position. Three concrete options for Phase 1.5 to choose between:

| Option | Mechanism | Tradeoffs |
|---|---|---|
| **A — Variant files are part of each component's public API; cross-component imports allowed.** | Manifest for `textarea` lists `input/variants.ts` as a file-level dependency. CLI installs both `input/variants.ts` and any utility deps it transitively needs, but does NOT install the rest of `input`. | **Pros:** No duplication of variant CSS strings; field-shaped components share a single source of truth. Mirrors today's actual import behavior. **Cons:** Manifest must support file-level granularity (more complex CLI logic); `input/variants.ts` becomes a public surface of `input` — renames/removals break `textarea` and any future consumers. Semver gets a new entity to version: variant exports. |
| **B — Every component owns its variants; no cross-component imports.** | `textarea` gets its own `variants.ts` derived from (or copied from) `input/variants.ts`. The dependency edge disappears entirely. | **Pros:** Components are fully self-contained; manifest stays at component granularity (simpler CLI); no public-API exposure for variant internals. **Cons:** Duplicated variant CSS strings between `input` and `textarea` (and any future field-shaped component); a fix in one doesn't propagate; consumers maintaining their own copies diverge over time. |
| **C — Extract shared variants to a neutral location.** | Create `components/_shared/field-variants.ts` (or similar). `input` and `textarea` both depend on it. No direct component-to-component edge. | **Pros:** Single source of truth; clean dependency graph (no component is "more equal" than another); manifest gets a new top-level category — "shared utilities" — alongside "components" and "internals" which is honest about the structure. **Cons:** Introduces a new file-system concept the CLI must understand; current pattern (in-component `variants.ts`) needs migration for any extracted variants. |

The choice has downstream implications: if **A** is picked, the CVA convergence question (F-13) inherits it — every CVA migration produces a new public surface. If **C** is picked, the pattern guide should establish where the line is between "shared in `_shared/`" and "lives in a component's `variants.ts`". If **B** is picked, the cost is accepted duplication.

_Direction (author opinion, label as such):_ I lean **C** because the auto-pull manifest already needs a category for non-component shared code (`utils.ts`, `internals/`), so adding `_shared/` is a small extension of an existing concept rather than a new one. But this is a judgment call, not the only defensible answer — **B** is materially simpler if the CLI team would rather not extend the manifest model. The decision belongs to Phase 1.5.

---

## 6. Cross-cutting observations

These are not flagged items per se — they're context for interpreting the scorecard.

- **Svelte 5 fluency is real.** The library uses snippets, `$state`, `$derived`, `$effect`, `$bindable`, and `bindable` getters cleanly in most places. Where it falls down (`F-8`, `F-9`), it's a design-level mismatch between the global-registry pattern and Svelte's reactivity, not a misunderstanding of the language.

- **Type discipline is high; type architecture is mixed.** Only 2 casts in the whole library is impressive. But `states[key] as UIState<X>` is a recurring pattern that erases the type contract at runtime. The "type safety" score is being held up by the absence of casts; what's missing is structural typing of the state registry itself.

- **CSS tokens exist but inline computed colors leak past them.** `ui.css` defines a comprehensive token set, but `color-mix(...)` and hardcoded shadows inside `.svelte` and `variants.ts` files mean the theme system can't reach every styled surface. This will limit how cleanly themes can be authored downstream.

- **Tests are entirely absent.** This is the single largest risk for Phase 4. Phase 2/3 (test strategy + tests) needs to land before any meaningful refactor of `modal`, `popover`, or the state system.

- **The "shippable library" framing is currently aspirational.** `private: true`, no `exports`, no install path, README doesn't mention packaging. The audit assumes the goal is to make it shippable; if instead it's "internal-app library that some other team copies," the bar shifts and several flagged items soften (especially F-1, F-2, F-6).

---

## 7. What I did NOT score

### Deferred to Phase 2 as test-strategy tiers (committed)

For a CLI-distributed UI primitive library, these are not optional audit dimensions — they're public contract claims. Phase 2 must include them as named tiers in the test strategy.

- **Accessibility.** Not assessed in depth in Phase 1. Surface evidence of a11y awareness exists (`role="alert"`, `aria-checked`, `role="switch"`, `aria-modal`, `aria-labelledby`/`aria-describedby` in modal, focus trapping via `trapFocus` in modal and sheet). What's *not* assessed: keyboard navigation completeness (Esc, Tab, arrow keys for menus, Enter/Space activation everywhere), screen-reader announcements (live regions on toast, status changes on switch/checkbox), color contrast at theme defaults, `prefers-reduced-motion` honoring across transitions, focus visibility under outline-suppressed designs. **Phase 2 must include an "a11y" test tier**, prioritized within Tier 1 (Critical) for components that take user input or trap focus (modal, sheet, popover, combobox, command, dropdown-menu, context-menu, select, switch, checkbox, radio-group, toggle, toggle-group, slider, calendar). Playwright is the right tool for keyboard nav and focus behavior; axe-core integration covers automatable a11y rules; manual screen-reader verification for the top 5 components before any major release.
- **SSR behavior.** Not assessed in Phase 1. The library scaffolds into SvelteKit consumer projects which run in SSR contexts; silk must not break consumers' SSR by accessing `document`/`window`/`localStorage` unguarded during server render. What I noticed informally: `themes/live.ts` checks `if (!browser)` before localStorage access; `modal-content.svelte:29` and `:37` check `typeof document === 'undefined'`; `utils.ts.trapFocus` accesses `document.activeElement` unconditionally — fine because it's only called in mounted lifecycle, but worth verifying. What's *not* assessed: whether every component's initial render is SSR-safe, whether `$effect` hydration drift occurs for the open-state-sync patterns (modal/popover/sheet/hover-card all do bidirectional sync with two `$effect`s — hydration cycle risk), whether the global `states` registry causes server-side state bleed between requests in a long-lived Node process. **Phase 2 must include an "SSR" test tier**: run every component through SvelteKit's SSR render and confirm no `document is not defined` / `localStorage is not defined` errors, plus a hydration-drift check on the bidirectional-sync components.

Both tiers are owned by Phase 2 (test strategy) and Phase 3 (test writing); the audit is committing to them, not deferring them indefinitely.

### Not scored, not committed

- **Performance.** Out of scope for a baseline structural audit. No flame graphs taken. Belongs to a future profiling pass, not Phase 2.
- **Visual regression.** Not assessed. Belongs to Phase 2 as a Tier 3 (Presentation) concern using Playwright snapshots — but the audit doesn't make a hard commitment here because visual regression infrastructure is heavier than the value at the current library maturity.
- **Bundle size.** Not measured. Becomes relevant if/when silk publishes as a package (currently it doesn't — auto-pull CLI sidesteps the bundling question for the library itself; only consumers care about their own bundle size).

---

## 8. Suggested questions for the third-party reviewer

**Answered between r1 and r2:**

- ~~Is "shippable library" the right framing, or is silk an internal copy-target?~~ → Auto-pull CLI model (shadcn-style), manifest-driven, conflicts don't overwrite without `--overwrite`. Dependency manifest is part of the public API contract.

**Open:**

1. Is the global `states` registry pattern (F-9, F-10, F-11) defensible, or should silk move to component-local state with explicit context? Note that the `accordion-item.svelte:9-12` getter pattern and the `tooltip.svelte:31-67` getter-proxy pattern are existing precedents for the alternative.
2. Should variant authoring converge on CVA (F-13), accepting a Phase 4 migration of 38 components?
3. F-3 / F-29 / F-30: should the parallel primitives be collapsed?
   - `dialog` into `modal`?
   - `tooltip` and `hover-card` into `popover`?
   - `modal-content` and `sheet-content` sharing an overlay primitive?
4. F-31: should `input/variants.ts` be extracted to a neutral shared location (e.g. `components/_shared/field-variants.ts`) so the textarea→input edge becomes textarea→shared and input→shared?
5. F-32: what counts as a breaking change to a component's manifest? Add-only is non-breaking — but is renaming an export breaking, even if the component file itself is unchanged?
6. F-4: agree that `popover` should expose only `open` bindable and treat the other two modes as a private wrapper convention?
7. **Button-specific decisions** (§2.1 hub paragraph). Button is fan-in ~12 and the largest blast radius in silk. Three open calls Phase 1.5 needs to make explicitly:
   - **`onhover` / `onhoverend` naming.** Keep silk-specific (lowercase, no event prefix), align to DOM (`onpointerenter` / `onpointerleave`), or drop these hooks entirely (callers can attach pointer listeners themselves via spread attributes)? Renaming later is breaking across every trigger.
   - **`ButtonState` type.** It's declared (`button/index.ts:28-30`), contains only `onclick`, and is barely consumed. Build it out into a real state model (and document what it's for), or delete it (and accept that button has no state surface). Living half-implemented is the worst option.
   - **`element` bindable union type.** Currently `HTMLButtonElement | HTMLAnchorElement | undefined`. Consumers must narrow. Three options: (a) keep the union; (b) split into two components (`Button` and `ButtonLink`) with distinct element types; (c) generic over the `href`-present case so the bindable type is inferred. Option (b) is the cleanest type story but the worst auto-pull story (now wrappers have to choose one of two button variants). Option (c) is the cleanest type story AND the cleanest auto-pull story but requires Svelte 5 component generics support.
8. **Diamond dedup behavior (§2.4).** Every popover-wrapper depends on both `popover` and `button` directly, while `popover` itself transitively pulls `button` via `popover-trigger.svelte:2`. The CLI's dedup behavior needs to be specified: does the manifest installation list `button` once (dedup at resolve time), warn the consumer about the redundant edge (lint), or silently treat them as separate install requests (last-write-wins on file content if `--overwrite`)? The honest case is benign — same destination — but the manifest format should be explicit about how diamonds resolve.
9. Are any of the scores you'd disagree with, and on what grounds (rubric application, missing evidence, or a fact I got wrong)?

---

**Phase 1 status: r4 complete, approved.** Reviewer approved moving to Phase 1.5 after r4 fixes. Pattern guide drafting begins next.

**Pattern guide (Phase 1.5) must include:**

- Primitive vs. wrapper policy (driven by F-3, F-29, F-30 — the Structural cohesion findings).
- Manifest format + semver policy (driven by F-2, F-32 — the API definition gap).
- Partial-import / shared-variants policy (driven by F-31, three options to choose between).
- Minimum-coherent-API rule for primitives (driven by F-4 — popover specifically).
- Button stability commitment: resolve `onhover`/`onhoverend` naming and `ButtonState` vestigial type before any other Phase 4 refactor (driven by §2.1 hub paragraph).
- a11y and SSR test tiers required in Phase 2 (committed in §7).
- All the convention items from r1 (variant authoring, state management, naming, etc.).
