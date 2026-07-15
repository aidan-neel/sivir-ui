<div align="center">

# Sivir UI

**SvelteKit component library inspired by shadcn/ui**

<p>
  <a href="https://svelte.dev"><img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-ff3e00?style=flat-square&logo=svelte&logoColor=white" /></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
  <a href="https://bun.sh"><img alt="Bun" src="https://img.shields.io/badge/Bun-1.3-fbf0df?style=flat-square&logo=bun&logoColor=black" /></a>
  <a href="packages/sivir/src/components"><img alt="Components" src="https://img.shields.io/badge/Components-41-2dd4bf?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/sivir-ui/milestone/2"><img alt="v1 milestone" src="https://img.shields.io/badge/Milestone-v1-9333ea?style=flat-square" /></a>
  <a href="https://github.com/aidan-neel/sivir-ui/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/aidan-neel/sivir-ui?style=flat-square&color=facc15" /></a>
</p>

[**Documentation**](https://sivir-ui.com/docs/introduction) · [**Components**](https://sivir-ui.com/docs/components/accordion) · [**Issues**](https://github.com/aidan-neel/sivir-ui/issues) · [**License**](LICENSE)

</div>

## Development

Requires Bun 1.3.11 or newer.

```sh
bun install --frozen-lockfile
bun run dev
```

Use `bun run check`, `bun run lint`, and `bun run test` for the workspace gates.
The browser suite runs separately with `bun --filter='docs' run test:browser`.

## Deployment

The docs app deploys with the Vercel adapter by default. Its production runtime
requires `THEME_REGISTRY_URL`; copy `apps/docs/.env.example` for the expected
shape. The registry requires the values documented in
[`apps/registry/.env.example`](apps/registry/.env.example) and
[`apps/registry/README.md`](apps/registry/README.md).

For the included Docker deployment, `docker compose up --build` selects the Node
adapter for docs and connects it to the registry service over the internal
network.
