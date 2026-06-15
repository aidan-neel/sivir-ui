# @silk/ui

[Silk UI](https://silk-ui.dev) as an installable Svelte 5 component library.

Prefer to own the code? Use the [`@silk/cli`](../cli) instead — it copies component
source into your repo, shadcn style. This package is the alternative: a regular runtime
dependency you import from.

```bash
npm install @silk/ui
```

## Usage

Import the design tokens once (e.g. in your root layout or app stylesheet), then import
components. Single primitives are named exports; compound components are namespaces.

```svelte
<script lang="ts">
	import { Button, Tabs } from '@silk/ui';
</script>

<Button variant="primary">Save</Button>

<Tabs.Root value="account">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">…</Tabs.Content>
	<Tabs.Content value="billing">…</Tabs.Content>
</Tabs.Root>
```

```css
/* app.css */
@import '@silk/ui/ui.css';
```

## Peer dependencies

- `svelte` `^5`
- `tailwindcss` `^4`
- `@sveltejs/kit` `^2` (optional — only needed for components that read the active
  route, e.g. `Breadcrumb`)
