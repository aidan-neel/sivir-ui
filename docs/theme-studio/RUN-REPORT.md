# Theme Studio Overhaul — Run Report

> Living report, updated as phases land. Branch: `theme-studio-overhaul` (off `github-workflows`).

## Status at a glance

| Phase                           | State                        | Verification                                               |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------- |
| 0 — Audit & decisions           | ✅ Landed                    | gap-report/decisions/PLAN written from grep evidence       |
| 1 — Token architecture & wiring | ✅ Landed                    | typecheck 0E, **581 tests**, lint 0E, build ✓              |
| 2 — File decomposition          | ✅ Landed (scoped, see D2.1) | typecheck 0E, lint 0E, Studio pixel-identical (Playwright) |
| 3 — Playground Preview rebuild  | ⏳ Not started               | —                                                          |
| 4 — Sidebar + toolbar           | ⏳ Not started               | —                                                          |
| 5 — Style prop (bounded)        | ⏳ Not started               | —                                                          |

Every landed phase is committed and green. The repo is never left half-migrated.

## What landed

**Phase 0** — Empirical token audit (`gap-report.md`): 28 truly-dead tokens, 77 consumed-but-uneditable, 16 emitted-but-unconsumed, plus a hardcode catalog. Corrected the pre-audit "126 unused tokens" claim (false). Finalized the group taxonomy (`decisions.md` D0.3).

**Phase 1** — Single-source-of-truth token wiring:

- 1a: wired dead/hardcoded values to existing tokens (card shadow, switch thumb, checkbox size/colors, sheet overlay duration); fixed button sm/lg padding shadowing so themed `buttonPaddingX` drives all sizes.
- 1b: tokenized remaining hardcodes (textarea, breadcrumb, calendar, toast, color-picker, shortcut, slider) and promoted `fieldPaddingY`, `buttonGap`, `switchTrackPadding`, `textareaMinHeight/PaddingY` into the editable schema.
- 1c: group-scoped **motion-curve easing** backbone — added `hoverEasing`, emit `--motion-easing-hover`, wired the button; made the dead `--motion-panel-easing` live; deleted inert aliases.
- 1d/tests: +8 tests asserting token emission + variant consumption.

**Phase 2** — Extracted the Playground preview (~1,030 lines + self-contained demo state) into `apps/docs/src/lib/components/themes/studio/studio-preview.svelte`. Studio page 4,079 → 2,921 lines. Scope decision D2.1: toolbar/inspector/dialog extraction folds into Phases 3–4.

## Decisions

See `decisions.md` (D0.1–D0.5, D1.1–D1.4, D2.1–D2.2). Highlights: snapshot-committed pre-existing WIP for clean diffs (D0.1); deferred inert-flag wiring (`primaryButtonOutline`, `invertedPanels`) + per-group radius/elevation to Phase 4 for visual QA (D1.2).

## Deferred / backlog (for Phases 3–5)

- **Preview rebuild (P3):** render a representative component from every token group (Modals, Menus, Controls, Surfaces, Transient, Nav/Data) so every control visibly changes something; add a group-coverage acceptance test. `studio-preview.svelte` is the module to rebuild.
- **Sidebar + toolbar (P4):** expose every customizable token by taxonomy; wire the deferred `primaryButtonOutline`/`invertedPanels` flags and the half-wired `--floating-*` menu tokens (D0.5); add per-group radius/elevation/focus-ring + border-treatment + density tokens; control↔token completeness cross-check test.
- **Style prop (P5):** token-bundle preset mechanism, separately-installable packaging; 3 styles (Flat/Soft/Sharp) on 3–5 reference components; `style-rollout.md` backlog.

## Known pre-existing issues (NOT introduced by this work)

- `/themes/[name].css` 500s in dev — the theme-**registry** backend isn't running (`getRegistryThemeBySlug` throws before `themeToCss`). Does not affect Studio rendering.
- Pre-existing svelte-check warnings (5) and eslint warnings (~134, mostly `svelte/require-each-key`) predate this work; baseline was green on errors.

## How to verify / resume

From `apps/docs`: `bun run check` · `bun run lint` · `bun run test:ci` · (root) `bun run build`. Live drive: `bun run dev`, then the Playwright scripts in `/tmp/silk-*.mjs` (chromium) screenshot `/themes/studio`. Recover the pre-existing WIP as uncommitted with `git reset --soft <snapshot-commit>` if desired.
