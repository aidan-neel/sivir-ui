# Sivir UI v1 Scope

**Status:** Proposed release contract  
**Target:** `@sivir/ui` 1.0.0  
**Planned:** 2026-07-19

## Decision

Sivir UI v1 will ship the component library, package and CLI installation
paths, core theming, documentation, and a read-only theme discovery flow.
Theme Studio is explicitly deferred until after v1.

This boundary keeps the first stable release focused on the workflows already
closest to production quality. It also avoids making the Studio's editor,
persistence, publishing, and ownership model part of the v1 support contract.

## Launch Promise

A Svelte 5 and Tailwind v4 user can install Sivir UI as a package or copy
component source with the CLI, follow the public documentation, customize the
documented theme tokens, and use every advertised component in a production
build.

## Included In v1

### Component library

- The current 41-component public catalog.
- Named and namespaced imports from `@sivir/ui`.
- Direct component exports documented by the package.
- Public `ui.css`, design tokens, component variants, and utilities.
- Supported keyboard, focus, pointer, reduced-motion, and SSR behavior.

### Distribution

- Package installation from npm with `@sivir/ui`.
- CLI commands `init`, `add`, `list`, and installation of supported themes.
- Complete isolated component dependency manifests.
- A repeatable release workflow with provenance and exact-artifact checks.

### Theming

- CSS-variable customization and the documented public token contract.
- Built-in theme presets.
- Applying and copying CSS or JSON for existing themes.
- A read-only theme gallery and CLI theme installation, provided the production
  registry passes the v1 deployment gates.

### Documentation and operations

- Installation, introduction, styling, theming, and component reference pages.
- Examples for every public component.
- A canonical public domain and consistent package, CLI, and documentation
  links.
- Production docs and registry deployment instructions.
- Release notes and a truthful v1 changelog.

## Explicitly Deferred

Theme Studio is not part of v1. The following capabilities must not be linked,
advertised, or required by a v1 workflow:

- The `/themes/studio` editor route and its live editing interface.
- Saving custom Studio projects in browser storage.
- Studio-specific CSS or JSON export.
- Publishing custom themes from the Studio.
- Theme ownership, update, delete, and moderation workflows.
- Advanced Studio controls, per-component overrides, undo/redo, and preview
  expansion.
- Refactoring or extending the historical plans in `docs/theme-studio/`.

The underlying theme engine is still required by v1. Studio removal must not
remove public tokens, presets, theme parsing, or runtime theme application used
outside the editor.

## Other Non-goals

- Adding new components to the v1 catalog.
- Supporting Svelte 4 or Tailwind 3.
- Introducing a second package or framework integration.
- Building theme author accounts or an administration console.
- Large internal refactors that do not close a release blocker.
- Automating a future major-version migration policy.

## Release Success Criteria

v1 is ready when all of the following are true:

- The public site contains no Theme Studio entry point or launch claim.
- The canonical domain is consistent in docs, CLI output, package metadata,
  sitemap data, and deployment configuration.
- All 41 advertised components match the package exports, CLI registry, and
  documentation catalog.
- Both the package-import and CLI source-copy paths pass in fresh SvelteKit
  consumers.
- The exact npm tarball passes typecheck and production build verification.
- Format, lint, typecheck, unit, SSR, registry, package, browser, and workspace
  build gates pass without a release-critical skipped interaction.
- The production docs, theme reads, npm package, and CLI receive smoke tests
  after release.
- No open P0 or P1 issue affects installation, documented behavior,
  accessibility, security, or data integrity.

## Release Decisions

These decisions must be recorded during Phase 1 and may not remain ambiguous at
release-candidate time:

- Canonical docs host: `https://sivir.dev`.
- Theme registry host: `https://registry.sivir.dev`.
- npm package remains `@sivir/ui`; target version/tag is `1.0.0` / `v1.0.0`.
- GitHub repo is `aidan-neel/sivir-ui`.
- Finalize release metadata before the Phase 4 candidate is frozen.
- Production registry is included as a read-only service; public writes return
  `405`.

## Plans

- [V1 implementation sequence](v1-implementation.md)
- [V1 release checklist](v1-release-checklist.md)
