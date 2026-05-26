# Silk Pattern Guide (Phase 1.5)

**Status:** complete (r2). Reviewer ratified all 8 originally-open decisions and added 8 cleanup fixes (A–H), all applied here. Phase 2 (test strategy) begins next.

## Revision history

- **r1**: initial draft, 8 open decisions in §16.
- **r2 (this revision)**: all 8 decisions ratified by reviewer. Cleanup fixes applied:
  - **A** — §4.4 contradiction with §3.6 resolved. Exact pins, no version ranges.
  - **B** — §4.1 peer-dep wording corrected (raising a peer dep floor is breaking; widening is not).
  - **C** — §13.4 "frozen" defined explicitly (no breaking changes, additive minor/patch allowed).
  - **D** — §5.1 CI enforcement added for "tolerated, never new" global state registry (ESLint rule + grandfather allowlist).
  - **E** — §3.2 and §10 confirm `_state.ts` is in `files` arrays.
  - **F** — §11.2 added a code-review-enforceable test for inline `color-mix` (appears in 2+ files → token).
  - **G** — §14.1 expanded with normative tooling-to-check mapping (axe-core / Playwright / manual).
  - **H** — §16 marked decisions confirmed; added §13.5 for the hover-hook ownership Phase 4 sub-decision that the reviewer flagged shouldn't be deferred indefinitely.

**How to read this:** every convention has the form `Rule → Rationale → Example`. Where there's a known precedent in the existing codebase, the rule cites the file. Where the rule contradicts current code, that's flagged at the bottom of each section as the Phase 4 migration cost.

**What this document is NOT:** an implementation plan. Phase 4 (refactor) executes against this guide. Phase 2 (test strategy) and Phase 3 (tests) pin behavior to stable boundaries — those boundaries are derived from this guide, not defined in it.

---

## 1. Distribution model (recap)

Silk distributes via a CLI that auto-pulls per-component dependencies declared in a manifest. Conflicts do not overwrite without `--overwrite`. This means:

- **The manifest is the public API contract.** Adding deps is non-breaking; removing them orphans primitives in consumer projects and is breaking.
- **Wrappers force their primitives' API on consumers.** Every consumer of a wrapper inherits the full surface of every primitive the wrapper pulls.
- **Primitives must expose the minimum coherent API.** Not the union of every wrapper's needs.
- **The CLI dedupes diamond dependencies.** When `A → B → C` and `A → C` both resolve, `C` installs once. (Open Phase 1.5+ implementation question, see §3.4.)

---

## 2. Primitive vs. wrapper policy

This is the largest decision the pattern guide makes. It directly resolves F-3, F-29, F-30.

### 2.1 The rule

A component is a **primitive** if it owns a unique architectural concern (overlay mechanics, floating positioning, focus trapping, hover-delay state, hand-rolled motion). A component is a **wrapper** if it composes existing primitives to deliver a higher-level UX pattern.

**Test:** if you cannot describe the component without using the phrase "wraps X and adds Y", it is a wrapper. If removing it would orphan an architectural concern, it is a primitive.

### 2.2 Wrappers must justify their existence per wrapper

A wrapper exists only if it provides:
1. A distinct UX commitment (semantic role, keyboard behavior, accessibility contract) that the primitive does not, AND
2. Enough composition to make the primitive's API ergonomic in that role.

If a wrapper exists only to alias the primitive ("`dialog` is `modal` with the role set"), it does not earn its own component. It becomes a documented usage example of the primitive.

### 2.3 Decisions for the known parallel-implementation clusters

These resolve F-3, F-29, F-30 from the audit.

#### F-29 — "Floating element with hover-delay"

Three implementations today (popover with `hoverable: true`, tooltip standalone, hover-card standalone). **Decision: collapse to one primitive (`popover`) with three documented wrapper patterns.**

- `popover` becomes the canonical floating primitive. Its public API exposes `open` (bindable), `hoverable`, `delay`, `closeDelay`, `placement`. The `state_key` and `state` modes (F-4) move to a separate internal helper used only by wrappers (see §2.4).
- `tooltip` becomes a thin wrapper over `popover` that hardcodes `hoverable: true`, sets a smaller default `delay`, applies role="tooltip", and ships with a minimal `Tooltip.Content` styled for inline guidance.
- `hover-card` becomes a thin wrapper over `popover` that hardcodes `hoverable: true`, sets a longer default `delay`, applies role="dialog" (or role="region", TBD by a11y pass), and ships with a larger `HoverCard.Content` styled for rich content.

**Rationale:** all three solve the same problem. Three implementations means three bug fix paths and three places to update theme tokens. Under auto-pull, this is the worst-case duplication scenario. The wrappers earn their existence by encoding the role/styling distinction, not by re-implementing the state machine.

**Migration cost (Phase 4):** rewrite `tooltip` and `hover-card` as `popover` wrappers. State models converge on `popover`'s. Consumers of `tooltip` and `hover-card` carry whatever state-mode bridge their version had; after migration, all three share the same state.

#### F-30 — "Modal-like overlay"

Two implementations today (`modal-content` and `sheet-content`). **Decision: extract an overlay primitive.**

- New: `_internal/overlay` (or `overlay/` as a peer primitive, naming TBD by §6 — see "internal vs. public primitives") owning portal + focus trap + click-outside + Escape + body-overflow management.
- `modal-content` and `sheet-content` both consume the overlay primitive and add their own animation surface on top.
- The overlay primitive is NOT a public component (consumers don't install it directly). It's a manifest-tracked utility, like `utils.cn`.

**Rationale:** modal and sheet are distinct UX commitments (centered confirmation dialog vs. side-anchored drawer). Both deserve to be primitives. But they share an overlay mechanism, and that mechanism is where the duplication lives. Extract the duplication, keep the distinct surfaces.

**Migration cost (Phase 4):** factor `modal-content` and `sheet-content` to share the overlay. Phase 3 tests pin overlay behavior before this refactor begins.

#### F-3 — `dialog` and `alert-dialog` wrap `modal`

Two thin wrappers exist today. **Decision: collapse `dialog` into `modal`; keep `alert-dialog` as a thin wrapper.**

- `dialog/dialog.svelte` is a six-line alias for `<Modal.Root bind:open>`. This does not earn its own component under §2.2. Delete `dialog/`; document the `Dialog`-style usage as `<Modal.Root>` in the README.
- `alert-dialog` does earn its existence: it asserts `role="alertdialog"`, suppresses click-outside-to-close by default (`allowClickOutside={false}`), and presents a constrained `Exit`/`Confirm` API (no `Close` slot, deliberate two-button shape). These are distinct UX commitments around the primitive.

**Rationale:** `dialog` aliases without adding. `alert-dialog` constrains for a specific role. The first is duplication; the second is composition.

**Migration cost (Phase 4):** remove `dialog/` from the library; update docs and any consumers' manifests during release notes. (Manifest semver: removing a component is breaking — see §5.)

### 2.4 Minimum-coherent-API rule for primitives

Resolves F-4. Primitives expose only the API needed by their canonical use case. APIs needed exclusively by wrappers move to a `*-internal` or `*-state` module that wrappers consume but consumers don't see in the primitive's public surface.

**For `popover` specifically:**
- Public: `open` (bindable), `placement`, `hoverable`, `delay`, `closeDelay`. That's it.
- Internal (wrapper-only): `popover/_state.ts` exports a `useExternalPopoverState(key)` helper for wrappers that need to share state across their own subtree. `state_key` and the raw `state` prop are dropped from the public surface.
- The `snake_case` `state_key` prop disappears entirely.

**Migration cost (Phase 4):** rewrite the six popover wrappers to use the internal helper instead of `state_key` / `state` props. Public consumers of `popover` see only `open` and never had to think about state plumbing.

### 2.5 Internal vs. public primitives

A primitive is **public** if a consumer might directly install and use it. A primitive is **internal** if it exists only to be composed by other library components.

- Public primitives live in `components/`. Their manifests are installable.
- Internal primitives live in `components/_internal/` (note the underscore prefix). Their manifests exist but they are installed only transitively — the CLI will not install an `_internal/` component as a top-level target. (CI-enforced.)

**Initial classification (Phase 4):**
- Public: `button`, `popover`, `modal`, `sheet`, every component a consumer would invoke directly.
- Internal: `overlay` (new, from F-30 extraction), any future primitive that's composition-only.

---

## 3. Manifest format

Resolves F-2 (design only; implementation deferred). Each component has a manifest declaring exactly what the CLI needs to install it.

### 3.1 Location and format

`components/<name>/manifest.ts` — TypeScript, not JSON, so the CLI gets type-checked manifests and editors get autocomplete. Each manifest exports a typed `Manifest` object.

```ts
// components/popover/manifest.ts
import type { Manifest } from '$lib/silk/_manifest/types';

export const manifest: Manifest = {
  name: 'popover',
  version: '1.0.0',
  visibility: 'public',
  files: [
    'components/popover/popover.svelte',
    'components/popover/popover-trigger.svelte',
    'components/popover/popover-content.svelte',
    'components/popover/popover-title.svelte',
    'components/popover/index.ts',
    'components/popover/_state.ts'
  ],
  components: ['button'],
  shared: ['utils.cn', 'utils.positionFloatingPanel', 'internals/state'],
  peerDependencies: {
    '@floating-ui/dom': '^1.0.0',
    'clsx': '^2.0.0',
    'tailwind-merge': '^2.0.0'
  }
};
```

### 3.2 Required fields

- **`name`** — manifest-stable component identifier (matches folder name).
- **`version`** — semver string, see §4.
- **`visibility`** — `'public'` (installable directly) or `'internal'` (transitive only). CI enforces.
- **`files`** — exact list of files the CLI installs into the consumer project. File-level granularity (resolves F-31). **Includes underscore-prefixed files** (`_state.ts`, `_helpers.ts`) when they exist — these are installed transitively with the component but not separately addressable as install targets. Example: `popover`'s `files` includes `components/popover/_state.ts` so wrappers (which auto-pull `popover`) get the file they need for `useExternalPopoverState`.
- **`components`** — array of component-name strings the CLI auto-pulls. Empty for leaf primitives.
- **`shared`** — array of `'utils.<symbol>'` or `'internals/<module>'` references. CLI installs the specific symbols (utils) or files (internals) — not the whole `utils.ts` file.
- **`peerDependencies`** — npm package deps the consumer must have installed; CLI warns if missing.

### 3.3 Optional fields

- **`description`** — one-line human-readable description for CLI list/search output.
- **`role`** — accessibility role(s) the component implements (informational; surfaces in CLI `inspect`).
- **`tier`** — `'tier-1'` | `'tier-2'` | `'tier-3'` test tier (set by Phase 2; informational).

### 3.4 Diamond dedup

Resolves §8 question 8. When a manifest resolution produces multiple paths to the same component (e.g. `combobox → popover → button` and `combobox → button`):

- The CLI installs each `name` exactly once.
- If two paths resolve to different `version`s of the same component, the CLI errors and asks the consumer to reconcile (`--prefer-newest` or `--prefer-pinned` flags reserved for future implementation).
- The manifest lints the redundant edge but does not error — explicit deps are valid even when transitively reachable, because primitive A's manifest shouldn't have to track primitive B's transitive deps to know whether to include them.

### 3.5 Shared utilities are a third manifest category

`shared` is its own field, alongside `components` and `peerDependencies`. This resolves F-31 by adopting Option C from the audit: shared variants and utilities live in a neutral location, neither attached to a "more equal" component nor duplicated.

- `utils.ts` exports the public utility surface (`cn`, `trapFocus`, `clickOutside`, `getFocusableElements`, `positionFloatingPanel`). Each is individually addressable from `shared`.
- `internals/state.svelte.ts` and `internals/transition.ts` are file-granular shared modules. Either the whole file installs, or the specific exported symbol.
- `components/_shared/field-variants.ts` (Phase 4) holds shared CVA variants between `input` and `textarea`. Both manifests reference `shared: ['_shared/field-variants']`.

### 3.6 What the manifest does NOT contain

- **No transitive deps.** Each manifest declares its direct deps only. The CLI resolves the graph.
- **No conditional logic.** No "if consumer has X installed, also do Y." Manifests are static data.
- **No version ranges for component deps.** Components pin exact versions; the CLI enforces version compatibility at install time.

---

## 4. Semver policy

Resolves F-32. Components are versioned individually (per manifest); the library does not have a single global version.

### 4.1 What counts as breaking (major version bump)

- **Removing a file from `files`.** Consumers' codebases break on the missing import.
- **Removing or renaming an exported symbol** from a component's public surface (its `index.ts`).
- **Removing a public prop, slot, or event.**
- **Changing a prop's type in a non-backward-compatible way** (narrowing, requiring previously-optional, changing the shape of a callback).
- **Removing a component from `components`.** This is the case Phase 1 r2 reviewer specifically flagged: removing a dep orphans the primitive in consumer projects that already auto-pulled it.
- **Changing default behavior** in a way visible to existing consumers (e.g. changing `allowClickOutside`'s default from `true` to `false`).
- **Raising the minimum required major version of a `peerDependency`.** (Widening a peer dep range is not breaking — peers are declared by the consumer, not silk. Tightening the floor is.)

### 4.2 What counts as additive (minor version bump)

- **Adding a new optional prop** (with a default that matches previous behavior).
- **Adding a new variant** to a CVA-driven component.
- **Adding a new exported symbol** to a component's `index.ts`.
- **Adding a new component** to `components` (consumers re-running the CLI will receive the new dep; existing installations are unaffected).
- **Adding a new file** to `files` (consumers re-running the CLI receive the new file).

### 4.3 What counts as patch (patch version bump)

- Bug fixes within a single file that don't change the public surface.
- Style adjustments that don't change visible default behavior.
- Internal refactors of `_internal/` primitives where the public surface is unchanged.

### 4.4 Versioning across multiple components

Components version independently. A change to `button` bumps `button`'s version; it does NOT cascade to wrappers. Wrappers pin their primitive deps to **exact versions** in `components: ['button@1.0.0']` (matching §3.6 — no version ranges). Range resolution at install time is a package-manager problem the auto-pull CLI does not need to solve. If a wrapper wants a newer primitive version, the wrapper bumps its own version and updates the pin.

### 4.5 CI enforcement

CI will run a `manifest-lint` step (Phase 1.5+ implementation) that:
- Verifies every file in `files` exists.
- Verifies every component in `components` has a manifest.
- Verifies every `shared` reference resolves.
- For each PR, compares the diff to the manifest version bump and errors if a breaking change isn't accompanied by a major bump.

---

## 5. State management

Resolves the F-9/F-10/F-11 cluster. The reviewer flagged the global `states` registry as the structural decision the audit hinges on. Phase 1.5 makes it explicitly.

### 5.1 The rule

**Default: component-local `$state` + context-passed getters.** Use the `accordion-item.svelte:9-12` pattern as the canonical reference: mutable state lives on a local `$state` object, parents pass it to children via `setContext` using a getter-proxy object so children see current values reactively.

```svelte
<!-- canonical pattern -->
<script>
  let { value, disabled }: Props = $props();

  setContext('my-component-item', {
    get value() { return value; },
    get disabled() { return disabled; }
  });
</script>
```

**Tolerated, never new: the `useState` / global `states` registry pattern.** Existing components that use it (modal, popover, combobox, command, etc.) keep it through Phase 4 because rewriting them is high-risk before tests exist. New components do not use it. The pattern guide does not require ripping it out — Phase 4 may collapse specific instances if Phase 3 tests permit, but no blanket migration.

**CI enforcement (Phase 1.5+ implementation):** an ESLint rule (`silk/no-new-global-state`) fails the build when a file imports from `$lib/silk/internals/state.svelte.ts` AND the file's component folder is not on a grandfather allowlist. The allowlist is the set of component folders that currently use the pattern (~16 components — enumerated at rule-implementation time from a grep of existing imports). New components added after the rule lands cannot import from the global registry without explicit allowlist update, which requires reviewer sign-off. The allowlist shrinks over time as Phase 4 migrations remove components; it never grows.

**Never: `style:` props with template-literal CSS strings** for state-driven styling (see F-14, switch.svelte). State drives classes via `cn()` or CVA, not inline style strings.

### 5.2 Rationale

The global `states` registry produces 8+ `svelte-ignore state_referenced_locally` suppressions, the `states[key] as UIState<X>` runtime cast pattern, the bidirectional-sync-via-two-effects pattern (F-8), and the `Math.random()` key generation (F-7). It works, but every one of those frictions is the pattern fighting Svelte 5's reactivity model. The accordion-item getter-proxy pattern is what Svelte 5 wants you to write.

### 5.3 Open question (Phase 4)

When (if ever) is it correct to remove a component from the global registry? Answer deferred to Phase 4 on a per-component basis, gated by Phase 3 test coverage. A blanket migration is not in scope.

### 5.4 Bidirectional sync

When a component takes a bindable prop (`open`, `value`, `checked`) AND maintains internal state, prefer a **single direction of source-of-truth** with derived reads:

- Source: external bindable prop.
- Internal `$state` is a write-target only, sync from prop via `$derived` or single `$effect`.
- No `syncedFoo` intermediate. No two-effect bidirectional dance.

If a component must support both directions, it's a candidate for the `_state.ts` internal helper (§2.4): explicit external-state mode, not a hidden bidirectional sync.

---

## 6. Variant authoring

Resolves F-13. Currently 4/42 components use CVA via `variants.ts`; the rest use inline conditional Tailwind classes.

### 6.1 The rule

**Use CVA (`tailwind-variants`) for any component with two or more visual variants, or any component where styling depends on multiple boolean props.** Authored in a sibling `variants.ts` file next to the component.

**Use inline Tailwind classes only when the component has no variants and styling is constant.** Components like `label`, `card-content`, `separator` are fine inline.

**Never:** template-literal class strings with multiple embedded ternaries (`checkbox.svelte:28-29`). If the styling needs three conditions, it's a CVA candidate.

### 6.2 Shared variants

When two components share variant scaffolding (current case: `input` and `textarea`), extract to `components/_shared/<name>-variants.ts` and reference from both manifests as `shared: ['_shared/<name>-variants']`. Variants live in `_shared/`, not in a "primary" component (see F-31 Option C resolution).

### 6.3 Migration cost (Phase 4)

~38 components currently use inline classes. Migration is not blanket — components with no variants stay inline. Estimated migration scope: ~15–20 components have inline conditional classes that meet the CVA threshold (two+ variants or multi-prop styling). The rest are fine.

Switch (F-14) specifically: the inline `style:` transition strings must move to CSS classes via CVA, even if no other variants exist for the component, because style strings in JS can't be themed.

---

## 7. Naming conventions

Resolves F-5, F-23, and standardizes the conventions that r1 noted were mostly-consistent.

### 7.1 Files

- Component folders: `kebab-case/` (e.g. `alert-dialog/`).
- Component files within a folder: `kebab-case.svelte` (e.g. `alert-dialog-trigger.svelte`).
- Manifest: `manifest.ts`.
- Public types and exports: `index.ts`.
- Variants: `variants.ts`.
- Internal state (rare): `_state.ts` (underscore-prefixed).

### 7.2 Props

- Camelcase (`closeDelay`, `onValueChange`, `allowClickOutside`).
- **Never snake_case in public props.** The `state_key` prop on popover (F-5) is the one violator; it's gone in Phase 4.
- Boolean props: positive phrasing (`disabled`, `hoverable`, `allowClickOutside` — not `notDisabled`).
- Bindable props: lowercase verb or noun (`open`, `value`, `checked`, `pressed`).

### 7.3 Events / callbacks

- Callbacks: `onValueChange`, `onPressedChange`, `onPageChange` — camelCase, prefixed `on`, suffixed `Change` when the callback fires on state change.
- DOM-style callbacks: `onclick`, `onhover`, `onhoverend` — lowercase, no separator. **Phase 4 open decision (see §8.1): keep `onhover`/`onhoverend` or align to DOM standard `onpointerenter`/`onpointerleave`.**

### 7.4 Variants

- Lowercase, single word when possible (`primary`, `secondary`, `ghost`, `outlined`).
- Multi-word: kebab-case if needed (`destructive-outlined`) — currently no two-word variants exist, so this is preempting future cases.
- Variants are part of the public API (manifest semver applies).

### 7.5 Types

- Per-component types live in `<component>/index.ts`.
- Type names: PascalCase, suffix `Props` for prop types, `State` for state types, `Context` for context types.
- Public types are exported from `index.ts`; internal helper types are not.

### 7.6 `class` prop

Every public component accepts a `class` prop, typed via `DefaultProps`. Components must use `DefaultProps` as the base for their prop type (F-23 — checkbox is the violator). Inline-redeclaring `class?: string` is not allowed.

```ts
// canonical
export type CheckboxProps = {
  checked?: boolean;
  label?: string;
  // ...
} & DefaultProps;
```

---

## 8. Type conventions

### 8.1 No `any`, justified `as`

- `any` is forbidden outside test files. The library currently has zero, hold the line.
- `as` casts must be justified by a comment explaining what the type system can't prove (current count: 2 across the library; one with no comment, one effectively self-explanatory). Pattern guide adds: if you write `as`, write a one-line comment naming the invariant being asserted.

### 8.2 No `@ts-ignore` / `@ts-expect-error`

The library currently has zero. Don't introduce them.

### 8.3 `svelte-ignore` suppressions

The 8+ `state_referenced_locally` suppressions are a debt the global-state-registry pattern incurs. New components must not introduce new `svelte-ignore` lines unless the suppression is justified by a comment naming the underlying Svelte 5 friction and why it's unavoidable here.

### 8.4 Generic component types

When a component's props are generic over a value type (`Tabs` is generic over the tab id, `RadioGroup` over the value), express the generic in `Props` via Svelte 5's generic component syntax (`<script lang="ts" generics="T">`). Avoid `unknown` and `as` casts for the value type.

### 8.5 `DefaultProps`

`DefaultProps` is the base for every public component's prop type. It carries:
- `class?: string`
- `children?: Snippet`
- `data-*` attributes via the existing `Partial<Record<`data-${string}`, ...>>` pattern

If a component does not accept `class`, it's a special case (probably internal) and must justify the exception.

---

## 9. Documentation conventions

Resolves the F-17/F-18/F-19 cluster.

### 9.1 README

The library's top-level `README.md` (silk/README.md) must contain:
- One-paragraph description of what silk is.
- Install instructions (CLI command: `npx silk add <component>`).
- Theming (link to `themes/AUTHORING.md`).
- Public component list with one-line descriptions.
- Link to pattern guide (`audit/phase-1.5-pattern-guide.md` or wherever it lives in the final structure).
- License.

Today: 18 lines describing folder structure only. Migration in Phase 4 release prep.

### 9.2 Docstrings

- Every exported prop type in `<component>/index.ts` gets a JSDoc block per field that isn't self-explanatory.
- Self-explanatory props (`children: Snippet`, `class?: string` via `DefaultProps`) need no docstring.
- Callbacks need a docstring naming what triggers them and what argument they receive.
- Bindable props need a docstring naming the source-of-truth direction.

### 9.3 "Why" comments

Use sparingly. The canonical examples are `accordion-item.svelte:7-8` (explains the getter pattern) and `modal-content.svelte:26-27` (explains the portal). Comments narrate **non-obvious decisions**. They never narrate **what** the code does.

Comments come down when the code is renamed or restructured to make the "why" obvious from the surface.

### 9.4 Public API surface docs

Each component's `index.ts` is treated as a public API surface. Adding/removing exports from `index.ts` triggers semver under §4. Internal helpers go in non-exported modules within the component folder.

---

## 10. Component file layout

Every component folder follows this skeleton:

```
components/<name>/
├── manifest.ts            (required)
├── index.ts               (required — public exports + types)
├── <name>.svelte          (required — root)
├── <name>-<part>.svelte   (optional — parts for compound components)
├── variants.ts            (optional — only when CVA variants exist)
└── _state.ts              (optional — only for primitives with wrapper-shared state)
```

Files prefixed with underscore (`_state.ts`, `_helpers.ts`) are not exported from `index.ts` and not directly installable by the CLI as standalone targets — they install only as part of the component. **They must be listed in the component's `manifest.ts` `files` array** (see §3.2) so they install transitively when wrappers auto-pull the component. Example: `popover/_state.ts` is in `popover/manifest.ts:files`, so installing `combobox` (which auto-pulls `popover`) brings `popover/_state.ts` along — combobox's manifest does not need to reference it separately.

---

## 11. Styling and theming

Resolves F-15, F-16.

### 11.1 Tokens-first

Component styling reads from CSS custom properties defined in `ui.css`. Hardcoded color values, dimensions, durations are forbidden in component files.

If a style needs a value not currently in `ui.css`:
1. Decide if it's a one-off (component-internal computed) or a token candidate (used elsewhere or themable).
2. If token candidate, add it to `ui.css` with both light and dark values and use the variable.
3. If one-off, derive from existing tokens via `color-mix` or `calc` rather than hardcoding (e.g. `color-mix(in srgb, var(--switch-track-active-bg) 78%, black)` — but see §11.2).

### 11.2 `color-mix` in components

Inline `color-mix` is allowed when:
- The mix is genuinely component-specific (e.g. the active border color of a switch derived from the active background).
- The base colors are tokens, not literals.

Inline `color-mix` is NOT allowed when:
- The mix produces a value used in more than one place (then it's a token).
- Either input is a literal hex (`color-mix(in srgb, var(--x) 50%, #fff)` should be `var(--white-blend-color)` or similar).

**Decidability test (code-review enforceable):** if the same `color-mix(...)` expression text appears in two or more files anywhere in `app/src/lib/silk/`, it must be promoted to a token in `ui.css`. If the expression appears in exactly one file, it is component-specific and may stay inline. Reviewers can verify by grep. This rule mechanizes "genuinely component-specific" so it doesn't depend on judgment.

### 11.3 Token sprawl audit (Phase 4)

`ui.css` currently has ~38 sizing tokens and ~41 color tokens. Phase 4 should audit which tokens are unused (component refactors will surface this) and collapse where reasonable. Pattern guide does not specify the final token set; the goal is one token per semantic concept, not per component.

### 11.4 Transitions

CSS transitions live in `ui.css` (via `@layer base`) or in CVA variants — never as JS template-literal strings on `style:transition` (F-14, switch).

Motion duration tokens (`--motion-duration-hover`, `--motion-duration-panel`, etc.) are the only way components express durations. No hardcoded `220ms` strings in components.

---

## 12. Error handling

Resolves F-25, F-26.

### 12.1 Boundary errors

Defensive guards happen at boundaries:
- User input (form parsing, color hex parsing in color-picker).
- Async operations (toast.promise, theme loading).
- External state (localStorage, browser feature detection).

### 12.2 No defensive guards for impossible cases

Internal helpers do not check for `undefined` arguments that the type system guarantees are present. Trust internal type contracts. If a helper's input could theoretically be `undefined`, narrow the type at the boundary; do not silently `return` in the helper.

### 12.3 Consistent guards

When a function has a `if (!state) return` pattern, every related function in the same file uses it (F-26: `toast.dismiss` is the violator). Inconsistency causes maintenance drift.

### 12.4 No magic numbers for durations

Durations come from CSS variables (read via `getCssDuration` in `internals/transition.ts:1`) or from named constants at the top of the file. Hardcoded `5600` / `4200` / `340` in toast (F-25) become `DEFAULT_TOAST_DURATION` / `DEFAULT_TOAST_RECOVERY_DURATION` etc., or read from `--motion-duration-toast-*` tokens.

---

## 13. Button stability commitment

Resolves §8 question 7 from the audit. Button is fan-in ~12, the largest blast radius in silk. Before any other Phase 4 refactor, Phase 4 resolves these three open questions about button:

### 13.1 `onhover` / `onhoverend` naming

**Decision: rename to `onpointerenter` / `onpointerleave` and align to DOM-standard naming.**

- Rationale: silk-specific naming is a footgun for consumers who expect DOM events. The hooks themselves are useful (debounced hover/end for popovers and tooltips), but they should match what consumers can wire up themselves via spread attributes.
- Migration: rename in `button/index.ts`, update every trigger (~10 files), bump `button`'s manifest to a major version, document in release notes.
- Open: should they remain in button's surface at all, or migrate to the popover wrappers that actually need debounced hover? Reviewer call — for now, keep them on button and rename.

### 13.2 `ButtonState` type

**Decision: delete the `ButtonState` type.**

- Rationale: it's declared (`button/index.ts:28-30`), contains only `onclick`, and is barely consumed. Half-implemented state surfaces are worse than no state surface.
- Migration: remove from `button/index.ts`. Bump `button`'s manifest to a major version (removing an exported type is breaking under §4.1).

### 13.3 `element` bindable union type

**Decision: keep the union. Document the narrowing pattern.**

- Rationale: option B (split into `Button` and `ButtonLink` components) would force every trigger to choose, doubling button's manifest fan-out. Option C (Svelte 5 component generics over the element type) is the cleanest answer but requires generic component support that may or may not be ergonomic — defer to a later phase if Svelte 5 makes this easier.
- Pattern guide rule: when consumers bind to `element`, they narrow at the use site (`if (element instanceof HTMLAnchorElement) { ... }`). Document this in the button JSDoc.

### 13.4 Button is the stability anchor

After §13.1–13.3 resolve in Phase 4, button's public API is **frozen** for the duration of Phase 4. "Frozen" means **no breaking changes** under §4.1 — adding new optional props (minor under §4.2), patch-level bug fixes (§4.3), and internal refactors that leave the public surface untouched are all allowed and expected. What's not allowed: renaming, removing, or retyping existing public props; removing exports; changing default behavior visible to consumers; removing files; raising peer dep floors. Other Phase 4 refactors (popover, modal, etc.) work against frozen-public-surface button. If button must take a breaking change again, that's a coordinated major version bump that pauses other Phase 4 work. **One narrow exception to the freeze:** §13.5 (hover-hook ownership) is an explicitly scheduled Phase 4 sub-decision that may produce a second major version bump for button. If it does, it pauses other Phase 4 work briefly, then Phase 4 resumes against the new frozen surface.

### 13.5 Hover-hook ownership (Phase 4 sub-decision)

After the rename in §13.1, `onpointerenter` / `onpointerleave` exist on `button`. The reviewer flagged a follow-on question: should these hooks live on `button` at all, or migrate to the popover wrappers that actually use them?

**Concrete options for Phase 4 to decide between:**

| Option | Mechanism | Trade-off |
|---|---|---|
| **A — Keep on `button`.** | `button` continues to expose `onpointerenter` / `onpointerleave`. Wrappers consume them as before. | **Pros:** No further migration; consistent button API; consumers can use the hooks even outside popover contexts. **Cons:** Every button consumer carries the API surface even when they don't use it; the hooks are debounced for popover semantics that don't apply outside floating contexts. |
| **B — Move to popover.** | Remove `onpointerenter` / `onpointerleave` from `button`. Move debounced-hover logic into `popover/_state.ts` (or `popover-trigger.svelte`). Wrappers that need the behavior wire it inside popover's surface, not button's. Standalone button consumers attach raw `onpointerenter` via spread attributes if they want it. | **Pros:** Button's API surface shrinks (good for the highest-fan-in primitive); the hover logic lives next to its consumer; cleaner separation between "I'm a clickable" and "I'm a hover-revealable trigger." **Cons:** A second breaking change to `button` during Phase 4 (major version bump); migration touches every popover-wrapper trigger. |

**Decision deadline:** Phase 4, immediately after the §13.1 rename lands and tests confirm popover behavior is intact. Pattern guide author leans Option B because it shrinks button's blast radius further, but explicitly flags this as a Phase 4 call requiring re-engagement — not a Phase 1.5 conclusion.

---

## 14. Test tier commitments (forward to Phase 2)

Audit §7 committed Phase 2 to including a11y and SSR tiers. Pattern guide makes that explicit:

### 14.1 A11y tier

Tier 1 (Critical) coverage for every component that:
- Traps focus or portals (modal, sheet).
- Accepts user input (input, textarea, checkbox, radio-group, switch, slider, calendar, color-picker).
- Manages popover-style interactions with keyboard nav (popover, combobox, command, context-menu, dropdown-menu, select).
- Toggles state (toggle, toggle-group, tabs).

**Tooling-to-check mapping (so Phase 2 doesn't re-derive it):**

| Check | Tool | Notes |
|---|---|---|
| WCAG rule subset (color contrast at theme defaults, role validity, labelable controls, ARIA usage) | **axe-core** (run inside Playwright) | Covers ~30–40% of WCAG SC. Does NOT cover semantics-of-context (e.g. "this label is wrong for this control"). |
| Keyboard navigation (Tab order, Esc, arrow keys for menus, Enter/Space activation, Home/End in listboxes) | **Playwright scripts** | One test file per component owning a keyboard interaction model. Asserts focus position after each key. |
| Focus management (trap, restore, initial focus, programmatic focus) | **Playwright scripts** | Same files as keyboard nav. Verifies `document.activeElement` after open/close. |
| Screen-reader announcements (live regions on toast, status changes on switch/checkbox, role and name correctness on every interactive) | **Manual** (NVDA + VoiceOver, top 5 components per release) | Cannot be reliably automated. Phase 2 specifies which 5 components and the manual test script. |
| Reduced-motion honoring | **Playwright with `prefers-reduced-motion: reduce` matchMedia override** | Asserts that components with transitions do not animate, or animate within reduced-motion budget. |

The above mapping is normative for Phase 2: a11y test plans cite which tool covers which check, not "axe handles a11y."

### 14.2 SSR tier

Every component runs through SvelteKit SSR. Test confirms:
- No `document is not defined` / `localStorage is not defined` / `window is not defined` server-render errors.
- Initial server-rendered HTML matches client-hydrated HTML for the default-prop case.
- Bidirectional-sync components (modal, popover, sheet, hover-card — currently) do not produce hydration drift.

Tools: SvelteKit's built-in SSR + Playwright assertion on first-paint vs. hydrated DOM.

### 14.3 Tier authoring

Phase 2 owns the full categorization. Phase 1.5 commits to the two non-negotiable tiers above; everything else is Phase 2's call.

---

## 15. What's NOT in this pattern guide

Explicitly out of scope:

- **CLI implementation.** The manifest format is specified here; the CLI that reads manifests, resolves graphs, installs files, and enforces conflicts is a separate workstream (Phase 1.5+ implementation, not pattern guide).
- **Theme studio.** Pattern guide covers theming via `ui.css` tokens. The theme studio (live editing, presets, persistence) is dev-side scaffolding outside silk's library scope.
- **Bundle size and performance.** Future workstream.
- **Visual regression test infrastructure.** Phase 2 may include as Tier 3; pattern guide doesn't mandate.
- **Migration tooling.** When Phase 4 makes breaking changes to a component, the manifest semver bump and release notes are the migration story. No codemod tooling specified.

---

## 16. Confirmed decisions

All eight decisions originally listed here as open were ratified in the pattern guide review. Recorded here so Phase 2/3/4 know the call:

1. **F-29 collapse direction → confirmed.** Tooltip and hover-card become popover wrappers in Phase 4.
2. **F-3 collapse direction → confirmed.** `dialog` deleted, `alert-dialog` kept.
3. **F-31 resolution → Option C confirmed.** Variants go to `_shared/`.
4. **State management default → confirmed.** Component-local getter pattern is the new default; existing global registry tolerated through Phase 4, CI-enforced grandfather allowlist (§5.1).
5. **`onhover`/`onhoverend` → renamed to `onpointerenter`/`onpointerleave`.** Confirmed. **Secondary question (now a Phase 4 sub-decision):** should these debounced-hover hooks remain on `button` at all, or migrate to the popover wrappers that actually need them? Phase 4 makes this call concretely — it's not deferred indefinitely. See §13.5 for the sub-decision framing.
6. **`ButtonState` deleted → confirmed.**
7. **Manifest format as TypeScript → confirmed.** Type-check-pass argument wins over portability since silk and its CLI live in the same monorepo.
8. **Per-component versioning → confirmed.**

### 16.1 Remaining open items (deferred to specific later phases)

- **§13.5 hover-hook ownership** (Phase 4 sub-decision): keep `onpointerenter`/`onpointerleave` on `button`, or move them to popover wrappers? Decided concretely during Phase 4, not deferred indefinitely.
- **Token sprawl audit** (Phase 4): identify unused `ui.css` tokens and collapse where reasonable. Not a Phase 1.5 decision because component refactors are what surface the unused tokens.

---

**Pattern guide status: complete.** Phase 2 (test strategy) begins next.
