# Plan 002: Harden the themes registry API (validation bounds, error mapping, abuse limits)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: Written against commit `41806b5` with a dirty
> working tree. Run `git diff --stat 41806b5..HEAD -- apps/registry` and, in
> all cases, compare the "Current state" excerpts below against the live code
> before editing; on a mismatch, STOP.
>
> **Secrets rule**: `apps/registry/.env` exists locally and contains live
> database credentials. NEVER read it into any file you write, never quote its
> contents in commits, tests, or reports. `.env.example` (step 5) gets
> placeholder values only.

## Status

**DONE — 2026-07-15.** Public writes are bounded, rate-limited, body-capped,
and protected by a non-leaking error boundary. Publish races map to 409,
strict database TLS is available through an explicit CA path, and the
production app is covered by 16 hermetic route tests.

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `41806b5`, 2026-07-06 (dirty working tree)
- **Issue**: withheld pending maintainer approval (public repo; security-sensitive)

## Why this matters

`POST /themes` is a public, unauthenticated write endpoint on a live service.
Today it accepts **unbounded strings** in every text field (a multi-megabyte
"name" or palette entry passes validation), has **no request-size or rate
limiting**, returns **500 with Elysia's default error surface** when Prisma
throws (including the publish race: two concurrent publishes of the same slug
→ unique-constraint violation → 500 instead of 409), and stores free-form
motion duration strings that the Theme Studio later parses with
`Number.parseFloat(...) || 0` — silently turning `"abc"` into a 0ms animation.
Deliberate decision context: full authentication/ownership for publishing is a
**separate product decision** (see plans/README.md "Direction" — theme
update/unpublish + ownership); this plan only adds input hygiene and abuse
resistance that any anonymous-write endpoint needs.

## Current state

- `apps/registry/src/index.ts` — Elysia app; mounts `themesController`, an
  `openapi` plugin at `/openapi`, listens on `PORT ?? 4100`.
- `apps/registry/src/services/themes/index.ts:29-36` — the write route:

  ```ts
  .post('/', ({ body }) => publishTheme(body), {
  	body: themeDraftSchema,
  	detail: { summary: 'Publish a new theme to the registry.' },
  	response: { 200: publishResponseSchema, 409: slugConflictSchema }
  })
  ```

- `apps/registry/src/services/themes/model.ts` — Elysia TypeBox schemas.
  Excerpts (note: **no maxLength anywhere**, durations are free strings):

  ```ts
  export const paletteSchema = t.Object({
  	background: t.String(),
  	border: t.String(),
  	...
  });
  export const motionSchema = t.Object({
  	panelDuration: t.String(),
  	...
  	overlayDuration: t.String(),
  	panelEasing: t.Optional(t.String())
  });
  const themeSharedFields = {
  	name: t.String({ minLength: 1 }),
  	description: t.String(),
  	publisher: t.Optional(t.String()),
  	...
  ```

- `apps/registry/src/services/themes/service.ts:78-103` — `publishTheme`:
  check-then-act on the slug (`findUnique` then `create`), so a concurrent
  duplicate publish hits the DB unique constraint and throws an unhandled
  `PrismaClientKnownRequestError` (code `P2002`) → 500.
- `apps/registry/src/lib/prisma.ts` — builds a `pg.Pool` with
  `ssl: { rejectUnauthorized: false }`; the comment documents this as a
  Supabase-pooler chain workaround. Treat as a **documented tradeoff** —
  step 6 adds an opt-in strict path, no behavior change by default.
- `apps/registry/tests/themes.test.ts` — hermetic route tests: they `mock`
  `@lib/prisma` with an in-memory fake **before importing the controller**, use
  `new Elysia().use(themesController)` + `app.handle(new Request(...))`.
  **Model all new tests after this file.** Test command: `bun test` from
  `apps/registry` (11 tests pass today).
- There is **no `.env.example`** in `apps/registry/`; required env vars
  (`DATABASE_URL`, `DIRECT_URL`) are only discoverable by reading
  `prisma.config.ts`/`src/lib/prisma.ts`.
- Repo conventions: tabs, conventional commits (`fix(registry): …`,
  `test(registry): …`).

## Commands you will need

| Purpose   | Command                                | Expected on success                                                      |
| --------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Install   | `bun install --frozen-lockfile` (root) | exit 0                                                                   |
| Typecheck | `bun --filter='registry' run check`    | exit 0 (runs prisma generate with placeholder URL first — that's normal) |
| Tests     | `cd apps/registry && bun test`         | all pass (11 today + new)                                                |
| Lint      | `bun --filter='registry' run lint`     | exit 0                                                                   |
| Format    | `bun run format:check` (root)          | exit 0                                                                   |

## Scope

**In scope**:

- `apps/registry/src/services/themes/model.ts`
- `apps/registry/src/services/themes/service.ts`
- `apps/registry/src/services/themes/index.ts`
- `apps/registry/src/index.ts`
- `apps/registry/src/lib/prisma.ts` (step 6 only — additive)
- `apps/registry/.env.example` (create; placeholders only)
- `apps/registry/tests/themes.test.ts` (extend)

**Out of scope**:

- Authentication / API keys / ownership on publish — a product decision,
  tracked as a Direction item, not this plan.
- `apps/registry/prisma/schema.prisma` and migrations — no schema changes.
- The Theme Studio client (`apps/docs/**`) — it already sends valid payloads.
- `apps/registry/.env` — never open it, never move it, never quote it.
- Deleting or renaming existing routes; response shapes for valid requests
  must not change (the docs proxy `apps/docs/src/lib/server/theme-registry.ts`
  and CLI depend on them).

## Git workflow

- Branch: `advisor/002-harden-registry-api`
- Conventional commits per step (`fix(registry): bound theme field lengths`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Bound every string field in the theme schemas

In `model.ts`, add TypeBox constraints. Suggested bounds (generous vs. real
data — presets in `apps/registry/src/services/themes/defaults.ts` are the
reference; verify none violates a bound):

- `name`: `{ minLength: 1, maxLength: 80 }`; `description`: `{ maxLength: 500 }`;
  `publisher`: `{ maxLength: 80 }`; `slug` (in `slugParamsSchema` AND the draft):
  `{ minLength: 1, maxLength: 80, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }`.
- Every palette color string: `{ maxLength: 64 }` (they hold CSS color values).
- `fontSans/fontMono/fontHeader`: `{ maxLength: 200 }` (font stacks are long).
- `radiusBase/Sm/Md/Lg/Xl`: `{ maxLength: 32 }`.
- Motion duration fields (`panelDuration`, `sheetDuration`, `overlayDuration`):
  `{ pattern: '^\\d+(\\.\\d+)?ms$', maxLength: 16 }` — this also fixes the
  silent `parseFloat→0` corruption downstream. `panelEasing` and
  `durationPresetSlugSchema`: `{ maxLength: 64 }`.

**Verify**: `cd apps/registry && bun test` → existing tests still pass (they
publish realistic drafts). `bun --filter='registry' run check` → exit 0.

### Step 2: Map the publish race and Prisma failures to correct statuses

In `service.ts` `publishTheme`, wrap the `prisma.theme.create` call: catch the
Prisma unique-constraint error (`code === 'P2002'` — import the error class
from the generated client at `@root/prisma/generated/prisma/client`, same
import root as `PrismaClient`; if the generated client exposes it under a
different path, check `prisma/generated/` after `bun --filter='registry' run
generate` rather than guessing) and rethrow the existing
`status(409, 'A theme with this slug already exists, try another one.')`.

**Verify**: new test from the Test plan (create-throws-P2002 → 409) passes.

### Step 3: Add a global error guard so internals never leak

In `src/index.ts`, add an `.onError` handler to the Elysia app _before_
`.use(themesController)`: for `code === 'VALIDATION'` and thrown
`status(...)` responses keep Elysia's behavior; for everything else log the
real error server-side (`console.error`) and return a plain 500 with the body
`"Internal error."` — no stack, no Prisma message.

**Verify**: new test (service throws generic `Error` → response body is
exactly `Internal error.`, status 500) passes.

### Step 4: Cap request body size and add a minimal publish rate limit

- Body cap: construct the app as
  `new Elysia({ serve: { maxRequestBodySize: 128 * 1024 } })` (128 KiB is ~10×
  a realistic theme). Confirm in Elysia's types that `serve` passes through to
  `Bun.serve` — if the installed Elysia version doesn't support it, STOP.
- Rate limit: in `services/themes/index.ts`, add a module-level in-memory
  limiter for the POST route only: key = client IP
  (`server?.requestIP(request)?.address ?? 'unknown'`), allow at most 5
  publishes per 10 minutes, reply `status(429, 'Too many publishes, try again later.')`.
  Keep it ~20 lines, no new dependency. Document in a comment that this is
  per-instance and resets on restart — acceptable for the current single
  instance.

**Verify**: new tests (6th rapid publish from same IP → 429; oversized-name
publish → 422) pass. NOTE: the body-size cap is enforced by `Bun.serve`, not by
`app.handle()`, so it is NOT unit-testable hermetically — verify by reading the
constructor options only, and say so in your report.

### Step 5: Add `.env.example` and document required env vars

Create `apps/registry/.env.example` with **placeholders only**:

```
# Supabase transaction pooler (runtime queries), port 6543
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres"
# Direct/session connection (migrations), port 5432
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
# Optional: path to a CA certificate to enable strict TLS verification (step 6)
# DATABASE_CA_CERT_PATH="./supabase-ca.crt"
```

**Verify**: `grep -c "PASSWORD" apps/registry/.env.example` → ≥1 (placeholders
present); `git check-ignore apps/registry/.env` → prints the path (the real
env file stays ignored).

### Step 6: Optional strict-TLS path (additive, no default change)

In `src/lib/prisma.ts`, keep current behavior as the default, but when
`process.env.DATABASE_CA_CERT_PATH` is set, read that file and use
`ssl: { ca, rejectUnauthorized: true }` instead. Extend the existing comment:
the lax default is a documented Supabase-pooler tradeoff; strict mode is
opt-in via env **and is the intended end state** — disabled chain validation
permits MITM of the database connection. Supabase's dashboard offers the CA
certificate for download; once the maintainer sets `DATABASE_CA_CERT_PATH` in
the deployment, the lax branch should be deleted. Note that in the code
comment. (Why not flip the default in this plan: an executor cannot test
against the production pooler, and a failed TLS handshake takes the live API
down on next deploy — the flip needs the maintainer's hands.)

**Verify**: `bun --filter='registry' run check` → exit 0 (tests never touch
this module — it stays mocked).

## Test plan

Extend `apps/registry/tests/themes.test.ts`, modeled exactly on its existing
hermetic pattern (mock `@lib/prisma` before importing the controller):

1. POST with 5,000-char `name` → 422 (validation).
2. POST with `panelDuration: "abc"` → 422.
3. POST valid draft twice where the mock's `create` throws an object shaped
   like `PrismaClientKnownRequestError` with `code: 'P2002'` → second → 409.
4. Service throwing `new Error('boom: secret detail')` → 500, body
   `Internal error.`, and the string `boom` absent from the response.
5. Six rapid POSTs, same IP → last one 429.
6. All existing 11 tests still green.

Verification: `cd apps/registry && bun test` → ≥16 pass, 0 fail.

## Done criteria

- [x] `cd apps/registry && bun test` exits 0 with ≥5 new tests
- [x] `bun --filter='registry' run check` exits 0
- [x] `bun run format:check` exits 0
- [x] Every public string field in the canonical v2 schema has an explicit bound
- [x] `grep -n "P2002" apps/registry/src/services/themes/service.ts` → ≥1 match
- [x] `apps/registry/.env.example` exists and contains placeholders only
- [x] Registry production and test changes stay within the planned surface
- [x] `plans/README.md` status row updated

## Completion report

- Registry route tests: 16 passing, including v2 bounds, duplicate races, rate
  limiting, body-cap configuration, and error redaction.
- Schema drift was reconciled: canonical v2 replaced the old free-form palette,
  radius, and duration strings with bounded strings plus closed enums.
- Request controls: 128 KiB maximum body and five publish attempts per client
  per ten minutes, with a bounded in-memory limiter.
- TLS: `DATABASE_CA_CERT_PATH` enables strict CA verification; the documented
  compatibility fallback remains available until deployment supplies a CA.
- Deployment: production app export/listen separation makes the real error
  boundary testable, and the container runs migrations before API startup.

## STOP conditions

- Any "Current state" excerpt mismatches the live code.
- A built-in default theme in `defaults.ts` violates one of the new bounds
  (bounds were mis-chosen — report the field and the offending value's
  _length_, not the value, and wait).
- The installed Elysia version rejects `serve.maxRequestBodySize` or lacks
  `server.requestIP` — report which, don't polyfill.
- You find yourself needing to open `apps/registry/.env` for any reason.
- Existing response shapes for valid requests change (docs proxy or CLI
  contract break).

## Maintenance notes

- The check-then-act slug flow is still there (now with a correct 409 on the
  race). If publish volume ever matters, replace it with create-and-catch.
- The in-memory rate limiter must be revisited if the registry moves to
  serverless/multi-instance (needs a shared store).
- Authentication/ownership on publish (update/unpublish, spam moderation
  beyond `HiddenDefault`) is the natural next step — tracked as Direction item
  D2 in `plans/README.md`; the `publisher` column already exists.
- Credential hygiene: the working-tree `.env` holds live credentials that were
  never committed (verified via `git ls-files` + `git log --all`). Rotating
  them anyway is cheap insurance the maintainer should consider; that action
  is theirs, not an executor's.
