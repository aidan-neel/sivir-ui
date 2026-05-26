# Silk registry

Elysia + Bun service that backs the theme registry. Persists themes in
Postgres via Prisma. Database lives on **Supabase** — there's no local pg
container.

## Setup

1. Create a free project at <https://supabase.com>.
2. Open **Project Settings → Database → Connection string** and grab two URLs:
   - **Transaction pooler** (port 6543) → `DATABASE_URL` — used at runtime.
   - **Session pooler** or **Direct connection** (port 5432) → `DIRECT_URL` — used by Prisma migrations.
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
statements — so migrations need a session connection on port 5432. Prisma's
schema declares both via `url` + `directUrl` so each command uses the right
one automatically.

## Migrating data off the old pg container

If you already had themes in the previous `postgres:16` docker volume:

```bash
# Dump from the old container while it's running
docker compose up -d db
docker compose exec db pg_dump -U app -d app --no-owner --no-privileges \
  --data-only --inserts > /tmp/themes-dump.sql

# Restore against Supabase (use the DIRECT_URL — session mode)
psql "$DIRECT_URL" -f /tmp/themes-dump.sql
```

Then `docker compose down -v` to delete the local volume.

## Production env vars

Run the registry image (`./Dockerfile`) with these set:

| Variable        | Required | Notes                                    |
| --------------- | -------- | ---------------------------------------- |
| `DATABASE_URL`  | yes      | Supabase transaction pooler (port 6543). |
| `DIRECT_URL`    | yes      | Supabase direct/session (port 5432).     |
| `PORT`          | no       | Defaults to 4100 via docker-compose.     |

## Managing themes

There's no built-in admin UI. The registry only exposes public read endpoints
(`GET /themes`, `GET /themes/:slug`) and a public publish endpoint
(`POST /themes`). To edit or delete a published theme, open the
**Supabase dashboard → Table editor → Theme**.
