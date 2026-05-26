<div align="center">

# Silk UI

**Svelte components that feel designed, not generated.**

40 Svelte 5 primitives, a live theme studio, and a token system that bends instead of breaks.

<p>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-1d4ed8?style=flat-square" /></a>
  <a href="https://svelte.dev"><img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-ff3e00?style=flat-square&logo=svelte&logoColor=white" /></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
  <a href="https://bun.sh"><img alt="Bun" src="https://img.shields.io/badge/Bun-1.3-fbf0df?style=flat-square&logo=bun&logoColor=black" /></a>
  <a href="app/src/lib/silk/components"><img alt="Components" src="https://img.shields.io/badge/Components-40-2dd4bf?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/ui/milestone/2"><img alt="v1 milestone" src="https://img.shields.io/badge/Milestone-v1-9333ea?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/ui/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/aidan-neel/ui?style=flat-square&color=facc15" /></a>
</p>

[**Documentation**](https://silk-ui.dev/docs/introduction) · [**Theme Studio**](https://silk-ui.dev/themes/studio) · [**Components**](https://silk-ui.dev/docs/components/accordion) · [**Issues**](ISSUES.md)

</div>

---

## Why Silk?

> Most component libraries hand you 40 things that all look the same.
> Silk hands you 40 things you can actually theme.

- 🎨 **Real theming system** — semantic tokens (`--color-primary`, `--motion-duration-panel`, `--radius-lg`) thread through every component. Change them once, everything updates.
- 🎛 **Live studio** — `/themes/studio` lets you tweak colors, type, radius, and motion across the whole library in real time. Publish themes to the registry, share them as `silk add theme <slug>`.
- ♿ **Accessible by default** — focus traps, scroll lock, keyboard semantics, ARIA — without the over-eager outlines.
- 🧩 **Compound APIs** — `Sheet.Root` / `Sheet.Trigger` / `Sheet.Content` patterns. Compose the way you'd build them by hand, but already done.
- ⚡ **Svelte 5 native** — runes, snippets, modern bindings. No compat shims, no legacy patterns.
- 🪶 **Copy-in, not vendor-locked** — components are source-distributed via the registry. Your codebase, your edits.

## Components

40 shipping. Every one is themed end-to-end and respects `prefers-reduced-motion`.

| Layout | Forms | Overlay | Feedback | Navigation | Data |
| --- | --- | --- | --- | --- | --- |
| Accordion | Button | Alert Dialog | Alert | Breadcrumb | Avatar |
| Card | Checkbox | Combobox | Badge | Pagination | Calendar |
| Collapsible | Color Picker | Command | Progress | Tabs | Marquee |
| Scroll Area | Combobox | Context Menu | Skeleton | | |
| Separator | Input | Dialog | Toast | | |
| Sheet | Label | Dropdown Menu | Tooltip | | |
| | Radio Group | Hover Card | | | |
| | Select | Modal | | | |
| | Slider | Popover | | | |
| | Switch | Sheet | | | |
| | Textarea | Shortcut | | | |
| | Toggle | | | | |
| | Toggle Group | | | | |

Browse them at [silk-ui.dev/docs/components](https://silk-ui.dev/docs/components/accordion).

## Quick start

> [!NOTE]
> Silk targets **SvelteKit + Tailwind v4 + Bun**. Other framework starters are post-v1 (see [`ISSUES.md`](ISSUES.md)).

```bash
# 1. spin up a SvelteKit + Tailwind v4 project
bun create svelte@latest my-app
cd my-app && bun install

# 2. initialize silk (CLI lands with v1)
bunx @aidan-neel/ui init

# 3. install a component
bunx @aidan-neel/ui add button dialog sheet calendar
```

Then in your `+page.svelte`:

```svelte
<script lang="ts">
  import * as Sheet from '$lib/silk/components/sheet';
  import { Button } from '$lib/silk/components/button';
</script>

<Sheet.Root>
  <Sheet.Trigger variant="outlined">Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Filters</Sheet.Title>
    </Sheet.Header>
    {/* …content… */}
  </Sheet.Content>
</Sheet.Root>
```

## Theming

Every component reads from a small set of CSS variables. Override them globally, locally, or via a published preset.

```css
:root {
  --color-primary: #5b6ad2;
  --color-secondary: #f1f5f9;
  --radius-lg: 0.72rem;
  --motion-duration-panel: 220ms;
  /* …and ~60 more tokens */
}
```

Or do it live in the **[Theme Studio](https://silk-ui.dev/themes/studio)** — shuffle, hand-tune, save, export to CSS or TypeScript, and publish to the shared registry.

## Project layout

```
silk/
├── app/                     # docs site (SvelteKit + Tailwind v4)
│   └── src/lib/silk/        # the component library itself (40 components)
├── registry/                # Elysia + Prisma service for distributing themes
│   └── src/services/themes  # publish / list / fetch theme presets
├── docker-compose.yml       # runs the registry container
├── ISSUES.md                # v1 backlog (~30 issues, tracked in GH milestone)
└── TODO.md                  # high-level v1 plan (CLI, registry flip, components)
```

The docs site is the active app today; the **registry** is where component source will live once we flip it (see issue #38).

## Development

```bash
# docs site (the one you see at silk-ui.dev)
cd app
bun install
bun run dev

# checks
bun run check     # svelte-check
bun run build
```

### Registry

Postgres lives on **Supabase** — no local pg container. Set both `DATABASE_URL` (transaction pooler, port 6543) and `DIRECT_URL` (session/direct, port 5432) in `registry/.env`. Then:

```bash
cd registry
bun --bun run prisma migrate deploy
bun run dev
```

Full setup in [`registry/README.md`](registry/README.md).

## Status & roadmap

Pre-v1, working towards a public 1.0. Track progress:

- [`ISSUES.md`](ISSUES.md) — ~30 v1-blocking issues, grouped by area
- [`TODO.md`](TODO.md) — high-level plan (CLI, registry-as-source-of-truth, polish)
- [GitHub milestone `v1`](https://github.com/aidan-neel/ui/milestone/2) — live tracker

Big v1 themes:

- [ ] `@silk-ui/cli` — `silk init`, `silk add`, `silk add theme`
- [ ] Registry-as-source-of-truth — docs consumes components from the registry
- [ ] Theme registry publish flow with API-key auth
- [ ] Keyboard navigation sweep across the 40 components
- [ ] GitHub Actions (lint + typecheck + build on PR)
- [ ] Landing polish + screenshots

## Contributing

Contributing guide is on the v1 list (see [`ISSUES.md`](ISSUES.md)). For now: file an issue, open a draft PR, or ping `@aidan-neel`.

## License

[MIT](LICENSE) © Aidan Neel.
