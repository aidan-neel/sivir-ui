# Silk v1 — issue backlog

~30 v1-blocking issues. Copy each line as a GitHub issue title. Post-v1
nice-to-haves live at the bottom so they don't get forgotten.

## CLI (the v1 headline)

- feat(cli): scaffold `@silk-ui/cli` package
- feat(cli): `silk init` — bootstrap silk.json, Tailwind v4 config, internals
- feat(cli): `silk add <component>` with transitive dep resolution
- feat(cli): `silk add theme <slug>` installs theme tokens
- chore(cli): publish `@silk-ui/cli` to npm

## Registry (source of truth flip)

- feat(registry): JSON schema (name, files, deps, version)
- feat(registry): `GET /api/registry/<component>` endpoint
- chore(registry): move component source from `app/` to `registry/components/`
- refactor(app): docs imports components from registry workspace package
- feat(registry): theme publish flow with API-key auth

## Component / bug fixes

- fix(accordion): arrow-key / Home / End keyboard navigation
- fix(calendar): full keyboard navigation (arrows, enter, escape)
- fix(radio-group + toggle-group): arrow-key roving tabindex
- fix(studio): Switch `variant` prop type error in studio page
- a11y: focus-ring + reduced-motion sweep across all 40 components

## Docs

- docs: write "Installation" page
- docs: write "Theming" page with token reference
- docs: write "CLI" reference page
- docs: write "Changelog" page (auto from registry)
- chore(docs): dark-mode screenshot pass on every component preview

## CI / CD

- chore(ci): GitHub Actions — lint + typecheck + build on PR
- chore(ci): changesets for release automation
- chore(ci): deploy preview per PR
- test(ci): Playwright smoke test per component

## Project / launch

- chore: README rewrite with screenshots
- chore: CONTRIBUTING.md + component-authoring guide
- chore: LICENSE confirm + SECURITY.md
- chore: GitHub issue + PR templates
- feat(landing): hero + interactive theme demo + feature grid
- feat: logo, favicon, OG image

---

## Post-v1 (do not block)

- feat(cli): `silk diff`, `silk update`, `silk list`
- feat(registry): per-component semver + browser UI at `/registry`
- feat: date-picker, form, input-otp, menubar, navigation-menu, table, sonner, resizable
- feat(studio): per-component playground, share via URL, Tailwind preset export
- perf: bundle-size budget, icon tree-shaking, virtualize long lists
- test: visual regression with `@playwright/test`
- feat: Figma design-tokens export, example starters (SvelteKit, Astro, Next)
- chore: TypeScript strict mode, ESLint tighten, dependabot
