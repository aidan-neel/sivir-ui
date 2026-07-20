# Phase 4: Validate The Release Candidate

## Objective

Produce one immutable v1 candidate and gather enough automated and manual
evidence for a go/no-go decision. This phase validates a commit, not a moving
branch.

## Entry Criteria

- Phases 1 through 3 are complete.
- Version, changelog, release date, badges, and release notes are final.
- Canonical production services selected in Phase 1 are available for smoke
  testing.
- All known P0 and P1 issues are closed.
- Release notes and rollback steps have draft owners.
- The maintainer has created and manually verified `sivir-skill`, the Sivir UI
  docs design skill used for docs pages and component reference quality.

## Work

### 1. Freeze the candidate

- Choose and record the candidate commit SHA.
- Reconcile generated files and remove accidental test artifacts.
- Confirm the working tree is clean before running release gates.
- Do not merge feature work into the candidate. Any blocker fix creates a new
  candidate and resets affected evidence.

### 2. Reproduce CI from a clean environment

- Install from the lockfile with the repository's pinned Bun version.
- Run audit, formatting, lint, all checks, all test projects, and both docs
  builds.
- Run package registry generation, CLI sandbox, and exact-artifact consumer
  verification.
- Run Installer Lab tests.
- Record command output or CI links against the candidate SHA.

### 3. Inspect the release artifact

- Build and retain the candidate tarball once.
- Confirm version, package metadata, license, expected source, CSS, CLI bundle,
  and generated registry are included.
- Confirm temporary files, secrets, test artifacts, and Studio-only assets are
  absent.
- Install that exact tarball in fresh package-import and CLI consumer fixtures.
- For the CLI fixture, invoke the tarball's installed `sivir` binary, run
  `init` and representative `add` commands, then typecheck and build. A CLI
  built directly from the working tree is not sufficient evidence.

### 4. Perform manual release QA

- Test homepage, installation, component navigation, representative component
  interactions, theming, and the read-only gallery if included.
- Test mobile and desktop widths, keyboard-only use, and reduced motion.
- Verify `/themes/studio` is not linked or presented as v1 functionality.
- Test canonical-domain URLs and, if included, production-like registry failure
  behavior.
- Review the v1 scope, changelog, release notes, and known limitations together.

### 5. Confirm the docs skill gate

- Confirm `sivir-skill` exists where the maintainer installed it.
- Spot-check at least one getting-started page and one component page against
  the skill's guidance.
- Do not invent or auto-generate the skill contents in this phase; the
  maintainer owns creation and verification.

### 6. Hold the go/no-go review

- Complete `plans/v1-release-checklist.md` through the pre-publish sections.
- Confirm zero open P0/P1 defects and assign every accepted P2.
- Confirm npm access, `NPM_TOKEN`, provenance permissions, DNS access, deploy
  access, and rollback ownership.
- Confirm the `sivir-skill` gate is complete.
- Approve the fully finalized candidate SHA in writing.

## Verification

```sh
bun install --frozen-lockfile
bun audit
bun run format:check
bun run lint
bun run check
bun --filter='docs' run test:ci
bun --filter='registry' run test
bun --filter='@sivir/ui' run test
bun --filter='docs' run test:browser
bun run build
DOCS_ADAPTER=node bun --filter='docs' run build
bun --filter='@sivir/ui' run sandbox
bun --filter='@sivir/ui' run verify:artifact
bun --filter='@sivir/ui' run verify:cli-artifact
bun --cwd apps/installer-lab test
```

The release workflow in `.github/workflows/publish.yml` must enforce the same
or stricter gates before `npm publish`.

## Exit Criteria

- [ ] One candidate SHA and tarball are recorded.
- [ ] Every automated gate passes from a clean environment.
- [ ] Both fresh-consumer installation models pass using the exact tarball.
- [ ] Manual product, responsive, accessibility, and production smoke QA pass.
- [ ] `sivir-skill` exists and was maintainer-verified against sample docs pages.
- [ ] Release checklist has no unchecked pre-publish blocker.
- [ ] Maintainer records a go decision and rollback owner.

## Reset Conditions

Create and validate a new candidate if any code, dependency, generated output,
configuration, or shipped documentation changes. A typo limited to private
planning notes does not reset the candidate.
