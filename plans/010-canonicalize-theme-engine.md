# Plan 010: Canonicalize and correct the theme engine

> **Executor instructions**: This is a schema migration. Complete the inventory
> and backup/compatibility decision before deleting legacy code.
>
> **Drift check**: Written against commit `41806b5` and the dirty working tree
> audited on 2026-07-14.

## Status

- **Priority**: P0
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: none
- **Category**: correctness / architecture

## Why this matters

The package ships two incompatible theme models and generators. The new v2
generator also emits self-referential neutral variables, while its documented
default disagrees with the baked stylesheet. CSS minimization cannot be safe
until one canonical token/schema contract exists.

## Current state

- `themes/theme.ts` defines the constrained v2 `Theme`; `themes/presets.ts`
  still defines and generates the legacy ~91-field `ThemeDraft`.
- `theme.ts:121` emits `--sivir-neutral-N: ... var(--sivir-neutral-N) ...`.
  CSS variable cycles invalidate warm/true neutral values.
- `ui.css` and `DEFAULT_THEME` disagree on brand, mono font, radii, density,
  and motion defaults despite `theme.ts` claiming they are identical.
- The registry backend currently validates/serves legacy `ThemeDraft`, while
  docs server code casts that payload to v2 `Theme`. The gallery/studio are
  currently disabled, but the incompatible paths still ship.
- CLI theme installation uses the legacy generator for remote registry data.

## Scope

The package theme API/generator, built-in presets, CLI theme path, registry
schema/service, persisted-theme migration, and focused theme tests. Docs UI
redesign is out of scope; only data-contract call sites change.

## Implementation

### Step 1: Inventory and choose the canonical contract

Make v2 `Theme` the only public authoring contract. Inventory persisted
registry rows and local-storage keys before migration. Define an explicit
legacy `ThemeDraft -> Theme` adapter only if real stored themes must survive;
do not preserve both generators indefinitely.

Document which core tokens are public customization axes. Component-private
geometry/color aliases are not part of the public theme model (Plan 011).

### Step 2: Fix generator correctness first

- Generate warm/true neutral ramps from immutable light/dark source values,
  never from the custom property being assigned.
- Pick one canonical default visual definition and generate/validate the baked
  core defaults from it. Remove the false “harmless, identical” assumption.
- Ensure every emitted property has a non-empty computed value in light and
  dark mode for every neutral, radius, density, and motion variant.

Add browser computed-style tests; serialized substring assertions alone are
not sufficient.

### Step 3: Migrate consumers atomically

Move built-in presets, CLI remote theme validation/generation, registry API
schemas/storage serialization, and Studio persistence to v2. Validate network
JSON at runtime rather than casting it. If production legacy rows exist,
migrate/export them before changing the API.

After all imports are migrated, remove `ThemeDraft`, the legacy generator,
legacy preset/style/transition catalogs, and obsolete package exports. Because
this is pre-1.0 release preparation, do not keep dead compatibility code
without a demonstrated consumer requirement.

### Step 4: Add contract tests

Test built-in and remote theme round trips, invalid payload rejection, CLI
installation into a fresh fixture, default parity, and computed CSS values.
Verify no package source imports `themes/presets` or `ThemeDraft` afterward.

## Verification

```sh
rg -n "ThemeDraft|themes/presets" packages/sivir/src packages/sivir/cli apps/registry/src apps/docs/src
bun --filter='@sivir/ui' run test
bun --filter='registry' run test
bun run check
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun run build
```

## Done criteria

- [ ] One public theme type and one CSS generator remain
- [ ] No emitted custom property references itself
- [ ] Baked and generated defaults are machine-checked for parity
- [ ] Registry and CLI validate the same versioned schema
- [ ] Legacy code is removed or a time-bounded migration adapter is documented
- [ ] Computed-style and fresh CLI theme tests pass

## STOP conditions

- Production ThemeDraft rows exist and no approved migration/export exists.
- A supposedly canonical field cannot reproduce a currently supported theme.
- Default parity requires an unapproved visual change; report the exact token
  diff for maintainer selection.

## Maintenance notes

Schema changes must be versioned and validated at I/O boundaries. Never add a
second generator to bridge a migration.
