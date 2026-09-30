# Sivir registry

Elysia + Bun service that backs the theme registry. Persists themes in
Postgres via Prisma. The database runs on **Supabase**; there is no local pg
container.

## Setup

1. Create a free project at <https://supabase.com>.
2. Open **Project Settings → Database → Connection string** and grab two URLs:
    - **Transaction pooler** (port 6543) → `DATABASE_URL`, used at runtime.
    - **Session pooler** or **Direct connection** (port 5432) → `DIRECT_URL`, used by Prisma migrations.
3. Copy `.env.example` to `.env` and paste both URLs. Append `?sslmode=require` if not already present.
4. Apply migrations:

    ```bash
    bun --bun run prisma migrate deploy
    ```

5. Start the dev server:

    ```bash
    bun run dev
    ```

    The service listens on `PORT` (default `4100` in docker-compose).

## Why two URLs?

Supabase's transaction pooler (port 6543) gives us serverless-friendly
connection pooling, but pgbouncer transaction mode can't run DDL or prepared
statements, so migrations need a session connection on port 5432. Prisma's
schema declares both via `url` + `directUrl` so each command uses the right
one automatically.

## Migrating data off the old pg container

If you already had themes in the previous `postgres:16` docker volume:

```bash
# Dump from the old container while it's running
docker compose up -d db
docker compose exec db pg_dump -U app -d app --no-owner --no-privileges \
  --data-only --inserts > /tmp/themes-dump.sql

# Restore against Supabase (use the DIRECT_URL in session mode)
psql "$DIRECT_URL" -f /tmp/themes-dump.sql
```

Then `docker compose down -v` to delete the local volume.

## Vercel deployment

The registry is an Elysia Bun Function. Create a Vercel project with
`apps/registry` as its Root Directory; `vercel.json` runs migrations and
generates Prisma's client for every deployment.

Set these environment variables in both Vercel environments:

| Vercel environment | `DATABASE_URL` / `DIRECT_URL` target |
| ------------------ | ------------------------------------ |
| Production         | Production Supabase project          |
| Preview            | Separate preview Supabase project    |

Set `REGISTRY_PUBLISH_SECRET` per environment as well, matching the docs
project's `THEME_REGISTRY_SECRET` for that environment. Leave it unset to keep
an environment read-only.

Assign `registry.sivir.dev` to the production deployment and
`registry-preview.sivir.dev` to the preview branch deployment. Do not share a
database between those deployments: preview migrations must not affect
production data.

## Docker deployment

Run the registry image (`./Dockerfile`) with these set:

| Variable                  | Required | Notes                                                 |
| ------------------------- | -------- | ----------------------------------------------------- |
| `DATABASE_URL`            | yes      | Supabase transaction pooler (port 6543).              |
| `DIRECT_URL`              | yes      | Supabase direct/session (port 5432); migrations.      |
| `REGISTRY_PUBLISH_SECRET` | no       | Enables publishing; shared with the docs server.      |
| `DATABASE_CA_CERT_PATH`   | no       | Enables strict TLS verification with a CA bundle.     |
| `PORT`                    | no       | Defaults to 4100 via docker-compose.                  |

The container runs `prisma migrate deploy` before starting the API, so Prisma
is intentionally retained as a production dependency.

## API

Every theme is stored as its complete portable `Theme` document (the contract
in `@sivir-ui/svelte/themes/theme`), so new optional sections and contract
versions need no schema migration. Built-in themes come from the package and
are never stored.

| Route                  | Access                  | Behavior                                                              |
| ---------------------- | ----------------------- | --------------------------------------------------------------------- |
| `GET /themes`          | public                  | `{ items, total, limit, offset }`. Built-ins first, then newest.      |
| `GET /themes/:slug`    | public                  | One theme document plus `id`, `source`, `createdAt`, `updatedAt`.     |
| `POST /themes`         | docs server             | Publishes a theme. `201 { theme, editToken }`.                        |
| `PUT /themes/:slug`    | docs server + edit token | Replaces the document. The slug cannot change.                       |
| `DELETE /themes/:slug` | docs server + edit token | Unpublishes the theme. `204`.                                        |

`GET /themes` accepts `q` (name, description, or publisher), `source`
(`all`, `sivir`, `community`), `limit` (1–100, default 60), and `offset`.

### Publishing model

Writes are accepted only from the Sivir docs server, which authenticates with
the `x-registry-secret` header. Without `REGISTRY_PUBLISH_SECRET` the registry
is read-only and writes return `503`. The docs server also sends
`x-registry-client`, a salted hash of the visitor's address, and the registry
allows five publishes per client per hour. Publishes are counted from the
append-only `PublishEvent` log inside a per-client advisory-locked transaction,
so parallel requests cannot overshoot the limit and unpublishing does not free
quota.

A publish returns an edit token exactly once; the registry stores only its
SHA-256 hash. Updates and deletes must send it as `Authorization: Bearer
<token>`. The Theme Studio keeps the tokens for themes published from that
browser.

Every payload goes through `parseTheme`, then registry policy: length limits
on identity and font fields, and no CSS that could load a resource or escape
its declaration (`url(`, `@import`, braces, semicolons, comments, escapes).
Built-in slugs are reserved.

## Tests

Route behavior is covered by `tests/themes.test.ts`, run with Bun's built-in
test runner:

```bash
bun --filter='registry' run test   # from the repo root
bun test                           # from apps/registry
```

The tests **do not need a database or `prisma generate`**. They replace
`@lib/prisma` with an in-memory store via `mock.module(...)` before the routes
load, then drive the Elysia app with `app.handle(new Request(...))`. They cover
listing, pagination, search, publishing, edit-token updates and deletes, rate
limiting, validation, and error handling.

## Managing themes

There's no admin UI. To moderate a published theme, open the **Supabase
dashboard → Table editor → Theme** and delete the row. To hide a built-in
theme from the listing, insert its slug into `HiddenDefault`.
