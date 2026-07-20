# Phase 1: Freeze The Release Contract

## Status

**DONE — 2026-07-19.** Identity, catalog freeze, Theme Studio removal, changelog
removal, and the requested component corrections are implemented and verified.

## Objective

Turn the [v1 scope](v1-scope.md) into one unambiguous public product surface.
At the end of this phase, contributors know exactly what v1 contains, the
product has one identity, and Theme Studio is no longer part of the shipped
experience.

## Recorded Decisions

| Decision             | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| Canonical docs host  | `https://sivir.dev`                                     |
| Theme registry host  | `https://registry.sivir.dev`                            |
| npm package          | `@sivir/ui`                                             |
| Target version / tag | `1.0.0` / `v1.0.0`                                      |
| GitHub repo          | `aidan-neel/sivir-ui`                                   |
| Theme Studio         | Deferred post-v1                                        |
| Changelog page       | Removed from v1 public docs                             |
| Public catalog       | 38 components (removed `marquee`, `panel`, `separator`) |
| Panel look           | `Card` `variant="panel"`                                |
| Registry writes      | `POST /api/themes` and `POST /themes` return `405`      |

## Frozen Catalog (38)

accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, card,
checkbox, code-block, collapsible, color-picker, combobox, command,
context-menu, copy-button, dropdown-menu, hover-card, input, label, modal,
pagination, popover, progress, radio-group, scroll-area, select, sheet,
shortcut, skeleton, slider, switch, tabs, textarea, toast, toggle,
toggle-group, tooltip

## Work Completed In Tree

### 1. Release identity

- CLI default registry is `https://registry.sivir.dev`.
- Theme browse errors and README docs links use `https://sivir.dev`.
- Docs `.env.example` points at `https://registry.sivir.dev`.
- Package remains `@sivir/ui`; version bump to `1.0.0` stays for Phase 3/4.

### 2. Catalog freeze and removals

- Removed public `marquee`, `panel`, and `separator` components, docs routes,
  barrel exports, and CLI registry entries.
- Moved the former Panel frame into `Card` as `variant="panel"`.
- CodeBlock and docs ComponentPreview consume the Card panel surface.
- Sheet examples use a simple border divider instead of Separator.

### 3. Theme Studio and changelog removed from v1

- Deleted `/themes/studio` and `/docs/changelog`.
- Removed Studio and Changelog links from navbar, side nav, sitemap, homepage,
  introduction, installation, theming, themes gallery, and examples.
- Docs and registry theme write endpoints return `405`.
- Core theme-engine assertions remain in
  `apps/docs/tests/unit/sivir/studio-preview.test.ts` under a non-Studio name.

### 4. Requested component corrections

- Pagination hero now shows a real paged list use case; existing unit coverage
  remains the correctness gate.
- Scroll Area no longer applies root `p-1`, so edge fades sit flush.
- Shortcut hero matches the basic control and toasts on activation.
- Command/Combobox search defaults tightened (`threshold=0.28`,
  `ignoreLocation`, `minMatchCharLength=2`); docs search names no longer dump
  long keyword bags.

## Verification

```sh
bun --filter='@sivir/ui' run build
bun --filter='@sivir/ui' run test
bun --filter='registry' run test
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun run check
```

Also confirm:

```sh
# no public Studio / changelog / removed components
# package dirs, docs routes, and components.ts stay in sync at 38
```

## Exit Criteria

- [x] Canonical domain and production hosts are recorded.
- [x] The 38-component catalog is frozen and mechanically consistent.
- [x] Theme Studio is absent from the v1 public surface.
- [x] Both production theme write endpoints return `405` and create no data.
- [x] Version and changelog messaging no longer advertise a public changelog or
      Studio.
- [x] Focused and workspace verification gates are green on this tree
      (`@sivir/ui` 48 pass, registry 9 pass, docs unit/SSR 467 pass, command +
      shortcut browser 45 pass, installer-lab 30 pass, `bun run check` clean).

## Not In This Phase

- Rebuilding Theme Studio.
- Creating the `sivir-skill` docs skill (Phase 4 manual gate).
- Publishing the package or creating the v1 tag.
