# Tabs variants — design

**Date:** 2026-05-30
**Status:** Approved

## Goal

Redo the Svelte `Tabs` component to support three style variants, building off the
Vercel-style animated tabs as the new `default`:

- `default` — no container; animated **underline** under the active tab + animated
  hover-highlight pill behind the hovered tab.
- `ghost` — no container; animated **filled pill** behind the active tab + hover-highlight pill.
- `outlined` — today's look: bordered `bg-secondary/40` container with a sliding filled pill,
  hover only brightens text.

## API

Add one prop to `Tabs.Root` (non-breaking):

```ts
export type TabsVariant = 'default' | 'ghost' | 'outlined';
// TabsProps gains:  variant?: TabsVariant   (default 'default')
// TabsState gains:  variant: TabsVariant
```

Compound API (`Root` / `List` / `Trigger` / `Content`) is unchanged. `variant` propagates
through the existing `'tabs'` context.

## Implementation

Almost all changes are in `tabs-list.svelte`, which already measures the active trigger and
slides an indicator. Extend it:

- Container classes switch on variant: `outlined` keeps the bordered box; `default`/`ghost`
  render a bare `inline-flex`.
- Active indicator switches on variant: `default` → 2px underline at the active rect's bottom;
  `ghost`/`outlined` → filled pill (current rendering).
- **Hover highlight** (`default` + `ghost` only): event delegation on the `[role="tablist"]`
  (`mouseover` to measure the hovered `[role="tab"]`, `mouseleave` to hide). Low-opacity,
  theme-aware pill (`bg-foreground/[0.08]`) that fades + slides.
- Reuse existing measurement (`offsetLeft/Top/Width/Height`), `ready` first-paint guard,
  `ResizeObserver`, and keyboard nav unchanged.

`tabs-trigger.svelte`: transparent bg, `relative z-10` above indicators, text color by
active/hover — no per-variant branching needed.

Use theme tokens (`--foreground`, `--secondary`, `--radius-*`, `--outline-shadow`,
`--motion-duration-panel`), not the Vercel hardcoded hex, so it themes in the studio.

Expose `data-variant` on the list for styling/testing hooks.

## Existing usages

Add `variant="outlined"` to the ~9 current `Tabs.Root` usages so they keep today's segmented
look (theme studio inspector, studio-preview, and the button/card/alert-dialog/theming/tabs
docs pages).

## Docs & tests

- Add a 3-variant showcase to `docs/components/tabs/+page.svelte`.
- Extend the existing tabs test to assert each variant renders its expected indicator via the
  `data-variant` hook.

## Out of scope

- No icon support in the `Tab` type (triggers already accept arbitrary children).
- No change to the `Content` panel.
