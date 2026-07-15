FROM oven/bun:1 AS base
WORKDIR /repo

COPY package.json bun.lock ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/registry/package.json ./apps/registry/
COPY packages/sivir/package.json ./packages/sivir/

RUN bun install --frozen-lockfile

COPY apps/registry ./apps/registry

WORKDIR /repo/apps/registry
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
	DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
	bun --bun run prisma generate

ENV PORT=4100
EXPOSE 4100

CMD ["sh", "-c", "bun --bun run prisma migrate deploy && bun run src/index.ts"]
