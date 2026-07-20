# Phase 2: Stabilize The Library And CLI

## Objective

Make every frozen v1 component reliable through both supported installation
models: package imports and CLI source copy.

## Entry Criteria

- Phase 1 is complete.
- Component names, exports, domain, theme support, and v1 non-goals are fixed.
- The branch contains only intended v1 changes.

## Work

### 1. Lock the public API

**Status: DONE — 2026-07-19.**

- Frozen catalog is **38** components (not 41).
- Contract tests in `packages/sivir/public-api.test.ts` lock:
  - package component directories ↔ frozen list
  - root barrel named vs namespaced exports
  - direct `@sivir/ui/components/<slug>` public parts
  - package `exports` map coverage
  - CLI registry public list
  - Card `variant="panel"` + `CARD_PANEL_*` surface helpers
- Props/variants vs docs audit is deferred to a later phase-2 pass if needed.

### 2. Close component blockers

- Triage current component changes as P0 through P3 using the implementation
  index policy.
- Prioritize runtime correctness, state isolation, keyboard and focus behavior,
  SSR, hydration, and reduced motion.
- Exercise overlays and compound components for escape, outside click, focus
  restoration, nested composition, and teardown.
- Resolve every skipped release-critical browser interaction.
- Defer visual polish that does not affect documented use.

### 3. Verify package installation

- Check package metadata, `files`, `exports`, CSS side effects, license, and
  peer/runtime dependencies.
- Build the package and inspect the generated registry and CLI bundle.
- Pack one tarball and install it into a fresh SvelteKit and Tailwind v4 app.
- Import `@sivir/ui/ui.css`, render representative simple and compound
  components, typecheck, and build the consumer.
- Ensure narrow imports do not require undocumented setup.

### 4. Verify CLI source copy

- Test `sivir init`, `sivir list`, individual `sivir add`, transitive
  dependencies, repeated adds, overwrite choices, and clear failures.
- Test the public Bun invocation as
  `bunx --package @sivir/ui sivir <command>`; `bunx @sivir/ui` is not a valid
  substitute because the package name and `sivir` binary name differ.
- Test representative components independently instead of relying only on
  `add *`.
- Mechanically compare external imports in installable files with manifest
  dependencies.
- Add a `verify:cli-artifact` script that consumes the one `.release/*.tgz`
  produced by `verify:artifact`, installs it in a clean app, invokes its
  installed `sivir` binary, runs `init` and representative `add` commands, then
  typechecks and builds the source-copy consumer. It must fail unless exactly
  one retained tarball exists and must not execute the CLI directly from the
  working tree or create a second artifact.
- Verify generated configuration uses the canonical domain.
- Verify supported built-in or read-only registry themes install without Theme
  Studio.

### 5. Protect the contract in CI

- Keep package component checks separate from CLI TypeScript checks while
  running both from workspace CI.
- Ensure package and CLI tests run before a release artifact is accepted.
- Add focused regression tests for each v1 blocker fixed in this phase.

## Verification

```sh
bun run format:check
bun run lint
bun run check
bun --filter='@sivir/ui' run test
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun --filter='@sivir/ui' run sandbox
bun --filter='@sivir/ui' run verify:artifact
bun --filter='@sivir/ui' run verify:cli-artifact
bun run build
```

Also run both Installer Lab modes against the local working tree:

- Package imports.
- CLI source copy.

## Exit Criteria

- [ ] Every frozen component is exported, documented, and installable as
      intended.
- [ ] Package-import and CLI-copy consumers typecheck and build from scratch.
- [ ] No P0 or P1 component, manifest, package, or CLI issue remains.
- [ ] No release-critical browser interaction is skipped.
- [ ] Regression tests cover each blocker fixed during the phase.
- [ ] Theme support works without any Studio dependency.

## Not In This Phase

- New components or variants not required by existing docs.
- Theme Studio storage, editor, or publishing work.
- Publishing to npm.
