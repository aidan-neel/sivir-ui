# Plan 011: Minimize distributable CSS and make components Tailwind-first

> **Executor instructions**: Preserve public theme axes, not private aliases.
> Run the reachability and consumer-build gates after each component family.
>
> **Drift check**: Written against commit `41806b5` and the 323-line,
> 11,485-byte `packages/sivir/src/ui.css` audited on 2026-07-14.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plan 009, Plan 010
- **Category**: CSS / architecture / performance

## Why this matters

The file has no component class selectors or keyframes, but it has become a
large component-default registry: 221 base declarations, including 101 exact
one-hop aliases. Component source then dereferences those private aliases
instead of expressing defaults with Tailwind and the small semantic theme.

## Current state

- `ui.css` is 323 lines / 11,485 bytes.
- Lines 119-258 are component geometry and pass-through color aliases.
- Lines 303-307 globally set every consumer element's border color.
- All five authored keyframes are live and referenced: Skeleton, Progress,
  Toast, and Marquee x/y. There are no unused keyframes to delete.
- Tooltip additionally imports `slot-text/style.css` (45 custom-class lines),
  so effective shipped CSS is larger than `ui.css`.
- Several hardcoded component transitions/animations bypass the reduced-motion
  variables; Skeleton's infinite animation is the clearest case.

## Target contract

`ui.css` may contain only Tailwind directives, the allowlisted public theme
tokens and dark values, and reduced-motion overrides. Keyframes stay colocated
with the components that use them. No component-name-prefixed variables,
global element rules, or component class selectors remain unless an exception
is documented with a consumer use case and test.

The numeric guardrail is **at most 175 lines and 8 KiB**, but the token
allowlist and absence of private aliases are the authoritative gates.

## Implementation

### Step 1: Freeze a public token allowlist

Keep only core fonts/role typography, semantic colors, radii, density/spacing,
elevation, focus, and motion axes required by the canonical v2 theme. Classify
every existing declaration as public axis, Tailwind utility token, dark value,
reduced-motion value, or private component default. Add a small static check
that fails on unapproved component prefixes and exact one-hop aliases.

### Step 2: Migrate components by family

Replace private aliases with Tailwind utilities or direct semantic tokens in
source: controls/fields; badges/status; panels/cards/menus; overlays; feedback;
then remaining layout components. Fixed widths, heights, padding, and gaps are
component Tailwind defaults, not global theme variables. Use arbitrary values
only when Tailwind has no equivalent and the value is genuinely dynamic.

After each family: run Svelte check, browser tests, token lint, build registry,
and ensure generated copies match source. Do not edit generated registry files
by hand.

### Step 3: Remove the global and external CSS exceptions

Give Checkbox and any other colorless border explicit Tailwind border-color
utilities, then delete the `@layer base` universal border rule.

Replace Tooltip's `slot-text` class stylesheet with a simple Tailwind/Svelte
implementation or remove the cosmetic roll; remove the dependency/import and
update Tooltip/CopyButton manifests and descriptions. Remove direct
`tailwind-merge` dependencies/manifests where `cnfast` is the actual utility.

### Step 4: Make motion complete

Route every transition through the canonical motion variables and add
`motion-reduce:transition-none` / `motion-reduce:animate-none` where applicable.
Keep all five currently used keyframes unless a measured simplification
reduces total code without new indirection. Add a check that every keyframe has
at least one source reference and computed reduced-motion browser coverage.

### Step 5: Delete private aliases and enforce the budget

Remove component-prefixed declarations and now-unused intermediate spacing
aliases. Verify the source file, generated registry copy, and built CSS. Record
final line/declaration/byte counts in the completion report.

## Verification

```sh
wc -l -c packages/sivir/src/ui.css
rg -n '^\s*--(button|badge|field|panel|card|menu|command|tooltip|switch|checkbox|toast|tabs|progress|modal|sheet|textarea|breadcrumb|toggle|shortcut|slider)-' packages/sivir/src/ui.css
rg -n "slot-text/style.css|tailwind-merge" packages/sivir/src packages/sivir/package.json
bun --filter='@sivir/ui' run test
bun run check
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun run build
bun run format:check
```

## Done criteria

- [ ] `ui.css` is <=175 lines and <=8 KiB
- [ ] No private component-token prefixes or universal element rules remain
- [ ] No external component class stylesheet is imported
- [ ] All five retained keyframes are referenced and reduced-motion safe
- [ ] Every component still has equivalent visual/interaction browser coverage
- [ ] Source and registry output match; fresh consumer build passes

## STOP conditions

- Removing a token breaks a documented public customization example.
- A visual change cannot be distinguished from an intended theme correction.
- A component needs custom CSS that Tailwind cannot express; document the
  exact limitation and request the narrow exception before adding a class.

## Maintenance notes

Prefer semantic Tailwind utilities in component variants. A new global token
requires evidence that it is a cross-component theme axis, not a convenient
alias for one component.
