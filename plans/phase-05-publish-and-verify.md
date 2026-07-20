# Phase 5: Publish And Verify v1

## Objective

Publish the approved candidate as `@sivir/ui@1.0.0`, deploy matching public
documentation, and verify real user workflows from production.

## Entry Criteria

- Phase 4 has a written go decision for a specific candidate.
- The release checklist has no pre-publish blocker.
- npm, GitHub, DNS, and docs deployment access are confirmed. Registry access
  is confirmed if the read-only service is included.
- Rollback and patch-release owners are available.

## Work

### 1. Confirm the approved release

- Confirm `packages/sivir/package.json` is `1.0.0` and the changelog, release
  date, public badges, and release notes are final.
- Confirm the release commit exactly matches the approved Phase 4 candidate.
- If any shipped file must change, stop and produce a new Phase 4 candidate.

### 2. Create the release

- Create signed-off tag `v1.0.0` at the final release commit.
- Publish the GitHub release with scope, install instructions, limitations, and
  upgrade expectations.
- Allow `.github/workflows/publish.yml` to build, verify, and publish the exact
  release artifact with provenance.
- Do not run an ad hoc local publish if the workflow fails; diagnose and create
  a patch or corrected release commit as appropriate.

### 3. Verify npm

- Wait for the registry to return `@sivir/ui@1.0.0`.
- Inspect npm metadata, provenance, README, license, exports, and file list.
- Create a new external SvelteKit consumer and install from npm.
- Verify package imports, `ui.css`, typecheck, and production build.
- Run the published CLI through `init`, `list`, and representative `add`
  operations in a separate clean app.

### 4. Deploy and verify production

- Deploy docs from the final release commit after npm availability is
  confirmed.
- Deploy or retain the read-only registry according to the Phase 1 decision.
- Verify canonical DNS, TLS, redirects, sitemap, metadata, docs navigation,
  install commands, and theme reads.
- Confirm no production page links to Theme Studio.
- Verify errors are observable without exposing secrets or internal details.

### 5. Monitor and close

- Watch publish, deployment, registry, and docs logs during the release window.
- Repeat package, CLI, docs, and theme smoke tests after caches have settled.
- Triage regressions immediately. Use `1.0.1` for a package fix; do not replace
  or silently alter `1.0.0`.
- Record deferred P2/P3 items and create a separate post-v1 Theme Studio
  milestone.
- Complete and archive the release checklist with links to evidence.

## Verification

```sh
npm view @sivir/ui@1.0.0 version
npm view @sivir/ui@1.0.0 dist.integrity
npm view @sivir/ui dist-tags.latest
bunx --package @sivir/ui@1.0.0 sivir --help
```

In clean consumers, verify:

```sh
bun add @sivir/ui
bun run check
bun run build
```

Also verify the CLI source-copy flow and production URLs manually. Commands
must use public npm and production services, not workspace aliases or local
tarballs.

## Exit Criteria

- [ ] `@sivir/ui@1.0.0` is available from npm with provenance.
- [ ] The npm `latest` tag resolves to `1.0.0` and an unpinned install receives
      v1.
- [ ] Package-import and CLI-copy flows pass against the public artifact.
- [ ] Production docs run the release commit on the canonical domain.
- [ ] Theme reads work as scoped, and public writes are not a v1 workflow.
- [ ] No production page exposes Theme Studio.
- [ ] Release checklist and evidence are complete.
- [ ] Any regression has an owner, severity, and patch or rollback decision.

## Rollback Guidance

- Roll docs back to the previous known-good deployment if the public site is
  unusable.
- Disable registry-dependent UI if theme reads threaten core docs availability.
- Deprecate a broken npm version and publish a corrected patch; never overwrite
  an immutable package version.
- Preserve logs, artifact integrity values, and the failing consumer fixture for
  diagnosis.
