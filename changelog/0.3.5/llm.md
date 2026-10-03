## Toolbar removed

The `Toolbar` component and its `sivir add toolbar` registry entry no longer exist. Do not import `Toolbar` from `@sivir-ui/svelte`. Replace it with a plain `<div role="toolbar" aria-label="…" class="flex flex-wrap items-center justify-between gap-2">` and put Buttons inside it. `Composer.Toolbar` is a separate part of Composer and still exists.

## Short CLI form

Docs, `llms.txt`, component pages, and the Sivir skill now run the CLI as `bunx @sivir-ui/svelte <command>` (for example `bunx @sivir-ui/svelte init -y` and `bunx @sivir-ui/svelte add button`). Bun resolves the package's single `sivir` binary only from Bun 1.3.14 on. On Bun 1.3.13 or older the short form fails with "could not determine executable to run". Check `bun --version` before running it, and fall back to `bunx --package @sivir-ui/svelte sivir <command>` on older Bun. With npm, `npx @sivir-ui/svelte <command>` works. The commands themselves are unchanged.
