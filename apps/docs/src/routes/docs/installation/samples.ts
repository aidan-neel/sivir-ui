// The code samples live outside the page because Vite's dev dependency scan reads every
// `<script>` in a .svelte file, including ones inside strings, and fails on the `$lib` import.
export const packageInstall = `bun add @sivir-ui/svelte
# npm i @sivir-ui/svelte
# pnpm add @sivir-ui/svelte`;

export const packageCss = `@import '@sivir-ui/svelte/ui.css';`;

export const packageUse = `<script>
  import { Button } from '@sivir-ui/svelte';
</script>

<Button>Get started</Button>`;

export const cliCss = `/* src/routes/layout.css */
@import '../lib/sivir/ui.css';`;

export const cliAdd = `bunx @sivir-ui/svelte add button
bunx @sivir-ui/svelte list`;

export const cliUse = `<script>
  import { Button } from '$lib/sivir/components/button';
</script>

<Button>Get started</Button>`;
