## Toolbar removed

The `Toolbar` component and its `sivir add toolbar` registry entry no longer exist. Do not import `Toolbar` from `@sivir-ui/svelte`. Replace it with a plain `<div role="toolbar" aria-label="…" class="flex flex-wrap items-center justify-between gap-2">` and put Buttons inside it. `Composer.Toolbar` is a separate part of Composer and still exists.
