<div align="center">

# Silk UI (WIP)

**Svelte components that feel designed, not generated.**

40 styled components, a live theme studio, and a token system.

<p>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-1d4ed8?style=flat-square" /></a>
  <a href="https://svelte.dev"><img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-ff3e00?style=flat-square&logo=svelte&logoColor=white" /></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
  <a href="https://bun.sh"><img alt="Bun" src="https://img.shields.io/badge/Bun-1.3-fbf0df?style=flat-square&logo=bun&logoColor=black" /></a>
  <a href="packages/silk/src/components"><img alt="Components" src="https://img.shields.io/badge/Components-40-2dd4bf?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/ui/milestone/2"><img alt="v1 milestone" src="https://img.shields.io/badge/Milestone-v1-9333ea?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/ui/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/aidan-neel/ui?style=flat-square&color=facc15" /></a>
</p>

[**Documentation**](https://silk-ui.dev/docs/introduction) · [**Theme Studio**](https://silk-ui.dev/themes/studio) · [**Components**](https://silk-ui.dev/docs/components/accordion) · [**Issues**](ISSUES.md)

</div>

## Components

40 shipping. Every one is themed end-to-end and respects `prefers-reduced-motion`.

| Layout      | Forms        | Overlay       | Feedback | Navigation | Data     |
| ----------- | ------------ | ------------- | -------- | ---------- | -------- |
| Accordion   | Button       | Alert Dialog  | Alert    | Breadcrumb | Avatar   |
| Card        | Checkbox     | Combobox      | Badge    | Pagination | Calendar |
| Collapsible | Color Picker | Command       | Progress | Tabs       | Marquee  |
| Scroll Area | Combobox     | Context Menu  | Skeleton |            |          |
| Separator   | Input        | Dialog        | Toast    |            |          |
| Sheet       | Label        | Dropdown Menu | Tooltip  |            |          |
|             | Radio Group  | Hover Card    |          |            |          |
|             | Select       | Modal         |          |            |          |
|             | Slider       | Popover       |          |            |          |
|             | Switch       | Sheet         |          |            |          |
|             | Textarea     | Shortcut      |          |            |          |
|             | Toggle       |               |          |            |          |
|             | Toggle Group |               |          |            |          |

## Repository layout

```
silk/
├── apps/
│   ├── docs/        # SvelteKit docs site + theme studio
│   └── registry/    # Elysia + Prisma API serving themes from Supabase
├── packages/
│   ├── cli/         # @silk/cli — installs components into consumer projects (silk init/add/list)
│   └── silk/        # @silk/ui — canonical component source, also published as a library
├── docker-compose.yml
├── turbo.json
└── package.json     # Bun workspaces + Turborepo
```

## Development

```bash
bun install         # install everything
bun run dev         # turbo runs docs + registry in parallel
bun run check       # type-check all workspaces
bun run build       # production build (adapter-node for docs)
```

Editing a component in `packages/silk/src/components/…` is live in the docs site via the
`@silk/ui` alias (`apps/docs/svelte.config.js`) — Vite picks the change up immediately.

## Production deploy (self-hosted)

The repo ships with a `docker-compose.yml` that builds both apps and runs them on the same
host. Provide `apps/registry/.env` with Supabase `DATABASE_URL` + `DIRECT_URL`
(see `apps/registry/README.md`), then:

```bash
docker compose up --build -d
```

The docs site listens on `:3000` and the registry on `:4100`.

## License

[MIT](LICENSE) © Aidan Neel.
