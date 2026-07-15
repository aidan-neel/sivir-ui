# Plan 013: Close package release gates and isolated-install gaps

> **Drift check**: Written against commit `41806b5` and the dirty working tree
> audited on 2026-07-14. Reconcile with Plans 001, 003, and 005 before editing
> workflows so the same gate is not implemented twice.

## Status

- **Priority**: P0 before tag
- **Effort**: M
- **Risk**: LOW
- **Depends on**: Plans 008-012; soft dependency on existing Plans 003 and 005
- **Category**: release / dependencies / CI

## Why this matters

CI and publish can be green while public component behavior, isolated CLI
installs, or package contents are broken. The current publish job runs only the
CLI TypeScript check and registry build before `npm publish`.

## Current state

- Package `check` covers `tsconfig.cli.json`, not Svelte component source.
- CI omits `@sivir/ui` package tests; publish omits package tests, browser
  tests, audit, and a packed fresh-consumer smoke test.
- Command imports `fuse.js` but its manifest omits it. Context Menu, Dropdown
  Menu, Modal/Alert Dialog, and Scroll Area import `@lucide/svelte` without
  declaring it in their isolated transitive install plans.
- `add *` and the sandbox mask these omissions by aggregating/predeclaring
  packages.
- Three core ColorPicker browser interactions are explicitly skipped.
- The current audit reports 1 critical, 5 high, 8 moderate, and 3 low
  dependency advisories; Plan 005 owns remediation.

## Implementation

### Step 1: Make manifests mechanically complete

Add missing runtime peers to their owning manifests, rebuild the registry, and
add a static test comparing external imports in every installable file with
the dependencies resolved for that component's isolated install plan. Test at
least Command and one icon-using component in separate fresh fixtures.

Remove stale dependencies discovered by the same test (including Command's
Popover edge after Plan 009 and direct `tailwind-merge` declarations after
Plan 011).

### Step 2: Establish a real package check

Add Svelte-aware component checking and persistent linting for package source;
keep the CLI TypeScript check as a separate named command. Ensure root CI runs
package check, registry/CLI tests, docs SSR/unit tests, and package tests.

### Step 3: Resolve every skipped release interaction

Fix and unskip ColorPicker Escape, saturation/value pointer, and hue pointer
tests. Treat any other skip in a public component browser suite as an explicit
release exception requiring rationale and an issue; do not silently count it
as green.

### Step 4: Gate the exact artifact

Before publish, run the full check/test/build set, `npm pack --dry-run`, inspect
the allowlisted package contents, install the tarball in a fresh SvelteKit
fixture, import `ui.css`, render representative components, run `svelte-check`,
and build. Publish only that verified tag/artifact.

Apply Plan 005 dependency updates and require zero critical/high reachable
advisories. Record accepted dev-tool residuals with reachability evidence.

## Verification

```sh
bun run format:check
bun run lint
bun run check
bun --filter='@sivir/ui' run test
bun --filter='registry' run test
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun run build
bun audit
cd packages/sivir && npm pack --dry-run
```

## Done criteria

- [ ] Every isolated component install declares all external runtime imports
- [ ] CI and publish run package component checks and tests
- [ ] No skipped core public-component browser interaction remains
- [ ] Packed tarball passes fresh SvelteKit check/build smoke test
- [ ] Plan 005 advisory criteria are satisfied
- [ ] Plans 001 and 003 are reconciled rather than duplicated

## STOP conditions

- A required package must be a direct dependency rather than an isolated CLI
  peer and ownership is unclear.
- The packed artifact differs from the artifact the publish step would use.
- A critical/high reachable advisory has no patched version; block the tag and
  report the dependency path.
