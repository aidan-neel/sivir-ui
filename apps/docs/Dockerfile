FROM oven/bun:1 AS build
WORKDIR /repo

COPY package.json bun.lock ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/registry/package.json ./apps/registry/
COPY packages/sivir/package.json ./packages/sivir/

RUN bun install --frozen-lockfile

COPY apps/docs ./apps/docs
COPY packages/sivir ./packages/sivir

WORKDIR /repo/apps/docs
RUN bun run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /repo/apps/docs/build ./build
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "build"]
