# @sivir-ui/svelte

Svelte 5 and Tailwind CSS v4 component library, inspired by shadcn/ui.

Install the package and import components from it. To own the source instead, use the
`sivir` CLI that ships in this package: run `sivir init`, then `sivir add <component>`.
See https://sivir.dev/docs/installation.

## Requirements

- **Svelte 5** and **Tailwind CSS v4** (peer dependencies). To start from a new
  SvelteKit app with Tailwind:
    ```sh
    bunx sv create my-app          # pick the minimal template
    cd my-app && bunx sv add tailwindcss
    ```

## Install

```sh
bun add @sivir-ui/svelte
# or: npm i @sivir-ui/svelte / pnpm add @sivir-ui/svelte
```

Runtime dependencies (`@floating-ui/dom`, `@lucide/svelte`, `cnfast`,
`tailwind-variants`, …) install automatically.

## Wire up the styles

Import Sivir's stylesheet once in your root CSS file, such as `src/routes/layout.css`
or `src/app.css`:

```css
@import '@sivir-ui/svelte/ui.css';
```

`ui.css` imports Tailwind, the Sivir theme variables, and the fonts, and registers
Sivir's components as a Tailwind source. Replace `@import 'tailwindcss';` with it
instead of importing both. Tailwind v4 still detects classes in your own files.

A fresh `sv add tailwindcss` already imports that CSS file from
`src/routes/+layout.svelte`.

## Fonts

Sivir's default theme sets `--font-sans` to Inter and `--font-mono` to
JetBrains Mono. Both come from `@fontsource/inter` and `@fontsource/jetbrains-mono`,
which `ui.css` imports as Latin subsets at weights 400 to 700. Your bundler serves
the `woff2` files from your app, so there is no request to Google Fonts at runtime.

You do not need a remote font link. To use a different face, override
`--font-sans`, `--font-mono`, or `--font-header` in your own CSS and load that
font yourself. The `profitable` preset, which uses Geist and Roboto Mono, works
this way.

## Use it

Single-element components are named exports:

```svelte
<script>
    import { Button, Input, Switch } from '@sivir-ui/svelte';
</script>

<Button>Get started</Button>
<Input placeholder="Email" />
<Switch />
```

Compound components are namespace exports; their parts hang off the namespace:

```svelte
<script>
    import { AlertDialog, Tabs } from '@sivir-ui/svelte';
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>This can't be undone.</AlertDialog.Description>
        <AlertDialog.Footer>
            <AlertDialog.Exit>Cancel</AlertDialog.Exit>
            <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<Tabs.Root value="one">
    <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="one">First panel</Tabs.Content>
    <Tabs.Content value="two">Second panel</Tabs.Content>
</Tabs.Root>
```

Each component also has its own entry point for narrower imports:

```ts
import { Button } from '@sivir-ui/svelte/components/button';
import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
```

## What's exported

- **Named:** `Badge`, `BrandMark`, `Button`, `Checkbox`, `CodeBlock`,
  `CopyButton`, `Input`, `Label`, `Markdown`, `Pagination`, `Progress`,
  `ReorderList`, `ResponseStream`, `ScrollArea`, `Shortcut`, `ShowMore`, `Skeleton`, `SkeletonSwap`,
  `Slider`, `Spinner`, `Switch`, `TaskSteps`, `Textarea`, `Toggle`, and the toast API (`Toast`, `Toaster`,
  `toast`, `getToastUIState`).
- **Namespaced:** `Accordion`, `Alert`, `AlertDialog`, `Attachment`, `Avatar`,
  `Breadcrumb`, `Card` (includes `variant="panel"`), `Collapsible`, `ColorPicker`,
  `Combobox`, `Command`, `Composer`, `ContextMenu`, `Conversation`, `DropdownMenu`,
  `FileDiff`, `FullscreenNav`, `Gauge`, `HoverCard`, `Message`, `Modal`, `NavigationMenu`, `Popover`,
  `Question`, `RadioGroup`, `Reasoning`, `Select`, `Sheet`, `Sidebar`, `Tabs`, `TagInput`, `ToggleGroup`, `Tool`, `Tooltip`, `Typography`.

## License

[MIT](../../LICENSE) © Aidan Neel.
