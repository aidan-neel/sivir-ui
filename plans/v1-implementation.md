# Sivir UI v1 Implementation

This is the execution index for the [v1 scope](v1-scope.md). Work proceeds in
order because each phase establishes the contract or evidence required by the
next one. A phase is complete only when its exit criteria are recorded.

## Phase Sequence

| Phase | Plan                                                            | Outcome                                                                                                | Depends on |
| ----- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| 1     | [Freeze the release contract](phase-01-release-contract.md)     | v1 surface is fixed, canonical identity is chosen, and Theme Studio is removed from the public product | None       |
| 2     | [Stabilize library and CLI](phase-02-library-and-cli.md)        | Public components and both installation models meet the frozen contract                                | Phase 1    |
| 3     | [Finish docs and deployment](phase-03-docs-and-deployment.md)   | Public guidance and production services accurately support v1                                          | Phase 2    |
| 4     | [Validate the release candidate](phase-04-release-candidate.md) | One immutable candidate passes automated and manual release gates                                      | Phase 3    |
| 5     | [Publish and verify v1](phase-05-publish-and-verify.md)         | The verified artifact is public and production workflows are confirmed                                 | Phase 4    |

## Execution Rules

- Do not add v1 scope while closing a phase. New product ideas go to post-v1.
- Fix failures at the earliest phase that owns the behavior, then rerun every
  affected downstream gate.
- Use one commit or candidate SHA as the input to Phase 4. Do not validate a
  moving branch and call it a release candidate.
- Do not tag or publish while the canonical domain, version, or release notes
  disagree.
- Do not treat existing green tests as proof that the packaged consumer paths
  work; both install models require fresh-app checks.
- Do not restore Theme Studio as a workaround for theme gallery, registry, or
  documentation gaps.

## Release Blocker Policy

The following failures block progression:

- **P0:** security exposure, data loss, package cannot install, application
  crash, or a release workflow that could publish the wrong artifact.
- **P1:** documented component or CLI behavior is broken, public accessibility
  regression, production deployment failure, or major docs/install mismatch.
- **P2:** non-critical defect with a practical workaround. It may be deferred
  only with an owner and issue.
- **P3:** polish or future enhancement. It does not block v1.

## Evidence To Keep

For each phase, add a short completion record to its plan containing:

- Completion date and candidate commit.
- Commands run and their results.
- Manual checks completed.
- Deferred issues with severity and owner.
- Any approved deviation from the plan.

## Completion

The implementation plan is complete only when every phase is complete and the
[release checklist](v1-release-checklist.md) has no unchecked blocker.
