# Silk v1 TODO

## Components (target: 40 shipping, current: 40)

15 new components added — primitives missing from the lineup plus one Magic UI
flair piece (marquee). All on theme, theme-token aware, reduce-motion-honoring.

- [x] accordion
- [x] avatar
- [x] calendar
- [x] collapsible
- [x] hover-card
- [x] label
- [x] marquee
- [x] pagination
- [x] progress
- [x] radio-group
- [x] scroll-area
- [x] separator
- [x] slider
- [x] toggle
- [x] toggle-group

Follow-ups:

- [x] Docs pages for each — `app/src/routes/docs/components/<slug>/+page.svelte`, registered in `app/src/lib/components.ts` so the sidebar picks them up.
- [ ] Per-component playground in the theme studio so motion tweaks are visible.
- [ ] Accessibility sweep on the new compound components (radio-group, accordion, calendar keyboard nav).

## CLI (`silk` or similar)

After components ship. Take inspiration from `shadcn` CLI.

Commands:

- `silk init` — bootstrap a project: install Tailwind v4 config, drop `silk/utils.ts`, `silk/internals/*`, seed theme tokens, write a `silk.json` config (paths, registry URL, alias).
- `silk add <component...>` — install one or more components into the consumer's source tree by pulling source files from the registry. Resolve and install transitive deps (e.g. `silk add dropdown-menu` brings popover, button, etc.).
- `silk add theme <theme-slug>` — install a theme preset (CSS variables + motion tokens) into the consumer's project. Same registry, different namespace.
- `silk diff <component>` — show local edits vs upstream registry source so consumers know what they've drifted from.
- `silk update <component...>` — re-pull the latest source. Warn on local edits unless `--force`.
- `silk list` — list everything in the registry by category.

Open questions:

- Distribution: npm package (`@silk-ui/cli`)? `bunx silk`?
- Auth: registry is public, but theme publishing flows through the existing `/api/themes` endpoint — needs an API key story.
- Framework targeting: assume SvelteKit + Tailwind v4 + Bun for now; add Vite/plain-Svelte later.

## Component registry (the actual source of truth)

The docs site currently *contains* the component source. We want a flip: the
registry contains the source, the docs *consume* it.

- [ ] Define registry JSON schema (per-component metadata: name, deps, files, registryDependencies, theme tokens used, version).
- [ ] Move component source out of `app/src/lib/silk/components/*` into a `registry/components/*` directory the registry app serves.
- [ ] Build step that emits `registry/dist/<component>.json` artifacts the CLI fetches over HTTP.
- [ ] Docs site (`app/`) imports from a shared workspace package, not from inline source. Updating a component happens in `registry/`, not `app/`.
- [ ] Existing theme registry in `registry/` extends to host the component registry too (single Prisma DB, two tables).
- [ ] Public endpoint: `GET /api/registry/<component>` returns the JSON the CLI consumes.

## Versioning

- [ ] Decide v1 component cut (the 40).
- [ ] Pick a versioning scheme for the registry (per-component semver? monolithic?).
- [ ] Set up changelog / release notes (auto-generated from registry diffs?).

## Pre-v1 polish

- [ ] Sweep accessibility: focus rings, ARIA on every interactive component.
- [ ] Verify every component works in dark mode against all built-in theme presets.
- [ ] Reduce-motion audit (every animation honors `prefers-reduced-motion`).
- [ ] Bundle size budget per component (registry should surface this).
