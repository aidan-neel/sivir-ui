# Sivir UI v1 Release Checklist

Use this checklist for the final go/no-go review. Detailed work belongs in the
[phase plans](v1-implementation.md); this file records release evidence.

## Scope And Identity

- [ ] The [v1 scope](v1-scope.md) is approved and frozen.
- [ ] Theme Studio is absent from public navigation, routes, metadata, docs,
      examples, and calls to action.
- [ ] Studio editing, saving, and publishing are not described as v1 features.
- [ ] The public changelog page is absent from v1 docs navigation and sitemap.
- [ ] The canonical domain `sivir.dev` is live and used consistently.
- [ ] Package, site, CLI, and release notes consistently identify v1.0.0.
- [ ] The public component count is 38 and component names agree everywhere.
- [ ] Maintainer-created `sivir-skill` is verified before candidate approval.

## Component Library

- [ ] Every advertised component is exported from the package.
- [ ] Every CLI-installable component has a complete manifest and dependency
      graph.
- [ ] Public props, variants, events, and composition behavior are documented.
- [ ] Keyboard, focus, pointer, escape, click-outside, and reduced-motion
      behaviors pass where applicable.
- [ ] SSR and hydration checks pass.
- [ ] No release-critical component test is skipped.

## Package And CLI

- [ ] `@sivir/ui` package metadata, license, exports, and files are correct.
- [ ] The package-import path passes in a fresh SvelteKit consumer.
- [ ] `sivir init` passes in a fresh SvelteKit consumer.
- [ ] The documented Bun invocation uses
      `bunx --package @sivir/ui sivir ...` because the package and binary names
      differ.
- [ ] `sivir add <component>` passes for representative simple, compound, and
      dependency-heavy components.
- [ ] `sivir add theme <slug>` installs built-in presets without a service; if
      remote themes are included, it uses the canonical registry and has a
      clear failure mode.
- [ ] Repeated CLI operations are safe and have tested overwrite behavior.
- [ ] The exact tarball verified in CI is the artifact selected for publish.

## Documentation And Themes

- [ ] Introduction, installation, styling, and theming pages match v1 behavior.
- [ ] Every public component has a reachable reference page and example.
- [ ] All install commands work when followed verbatim.
- [ ] Built-in themes work without Theme Studio.
- [ ] The gallery is read-only, or hidden if the registry is not a supported v1
      service.
- [ ] The sitemap and internal links contain no removed Studio route.
- [ ] Changelog and release notes contain no stale or contradictory versions.

## Automated Gates

- [ ] `bun install --frozen-lockfile`
- [ ] `bun audit`
- [ ] `bun run format:check`
- [ ] `bun run lint`
- [ ] `bun run check`
- [ ] `bun --filter='docs' run test:ci`
- [ ] `bun --filter='registry' run test`
- [ ] `bun --filter='@sivir/ui' run test`
- [ ] `bun --filter='docs' run test:browser`
- [ ] `bun run build`
- [ ] `DOCS_ADAPTER=node bun --filter='docs' run build`
- [ ] `bun --filter='@sivir/ui' run sandbox`
- [ ] `bun --filter='@sivir/ui' run verify:artifact`
- [ ] `bun --filter='@sivir/ui' run verify:cli-artifact`
- [ ] `bun --cwd apps/installer-lab test`

## Production Readiness

- [ ] Production docs environment variables are configured and documented.
- [ ] The registry path is resolved: either the read-only service meets the
      conditional gates below, or gallery and remote-theme features are hidden
      and docs have no runtime registry dependency.
- [ ] If included, registry migrations are applied before traffic reaches new
      code.
- [ ] If included, the docs site reaches the production registry over TLS.
- [ ] If included, `POST /api/themes` and `POST /themes` return `405` and create
      no data.
- [ ] No critical or high reachable dependency advisory is accepted.
- [ ] DNS, redirects, canonical metadata, and error pages are verified.
- [ ] Rollback owners and commands are recorded before release.

## Publish

- [ ] Package version is `1.0.0` and release tag will be `v1.0.0`.
- [ ] The release commit exactly matches the validated candidate.
- [ ] GitHub release notes describe v1 scope and known limitations.
- [ ] The publish workflow passes and npm provenance is present.
- [ ] `npm view @sivir/ui@1.0.0 version` returns `1.0.0`.
- [ ] `npm view @sivir/ui dist-tags.latest` returns `1.0.0`.
- [ ] A clean consumer installs from npm rather than the local tarball.
- [ ] Production docs are deployed from the release commit.

## Post-release

- [ ] Package import, CLI init/add, docs, and theme-read smoke tests pass in
      production.
- [ ] Error logs and availability are reviewed after release.
- [ ] Any release regression has an owner and severity.
- [ ] A patch release is prepared instead of overwriting the v1 artifact if a
      package defect is found.
- [ ] Theme Studio remains tracked as post-v1 work rather than an urgent v1
      follow-up.

## Go Or No-go

Release only when all P0 and P1 items are closed, every automated gate above is
green for the release commit, and rollback is available. Any exception requires
an explicit written decision from the maintainer before the tag is created.
