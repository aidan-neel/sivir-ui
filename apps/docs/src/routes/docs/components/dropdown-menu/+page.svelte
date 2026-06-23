<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@silk/ui/components/code-block';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import External from '@lucide/svelte/icons/external-link';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import BasicMenu from './examples/basic-menu.svelte';
	import BasicMenuSrc from './examples/basic-menu.svelte?raw';
	import RowActions from './examples/row-actions.svelte';
	import RowActionsSrc from './examples/row-actions.svelte?raw';
	import ShareMenu from './examples/share-menu.svelte';
	import ShareMenuSrc from './examples/share-menu.svelte?raw';
	import SortMenu from './examples/sort-menu.svelte';
	import SortMenuSrc from './examples/sort-menu.svelte?raw';
	import Inverted from './examples/inverted.svelte';
	import InvertedSrc from './examples/inverted.svelte?raw';

	const _TITLE = 'Dropdown Menu';
	const SLUG = 'dropdown-menu';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;

	const curIndex = components.indexOf(SLUG);
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{
			component: 'Root',
			prop: 'inverted',
			type: 'boolean',
			default: 'false',
			description: 'Dark theme panel with light text (when true).'
		},
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Context wrapper.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders a Button. Click opens the menu.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating menu surface.'
		},
		{
			component: 'Label',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Non-interactive group header.'
		},
		{
			component: 'Item',
			prop: 'callback',
			type: '() => void',
			default: '--',
			description: 'Use `callback`, not `onclick` -- the menu uses its own click handler.'
		},
		{
			component: 'Separator',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Horizontal divider.'
		},
		{
			component: 'Sub / SubTrigger / SubContent',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Nested submenu -- opens on hover/click on the trigger.'
		}
	];

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add dropdown-menu';
</script>

<svelte:head>
	<title>Silk · Dropdown Menu</title>
	<meta
		name="description"
		content="A list of actions anchored to a button. Use it for user menus, row-level actions, and anywhere a `…` button needs to do more than one thing."
	/>
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Dropdown Menu
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A list of actions anchored to a button. Use it for user menus, row-level actions, and
				anywhere a `…` button needs to do more than one thing.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={HeroSrc}>
			<Hero />
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<InstallCommand command={installCommand} />
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">
			Import Dropdown Menu and compose it with sub-components:
		</p>
		<CodeBlock
			code={`import * as DropdownMenu from '@silk/ui/components/dropdown-menu';\n\n<DropdownMenu.Root>\n  <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>\n  <DropdownMenu.Content>\n    <DropdownMenu.Item callback={handleClick}>\n      Action\n    </DropdownMenu.Item>\n  </DropdownMenu.Content>\n</DropdownMenu.Root>`}
			lang="svelte"
			copy="overlay"
		/>
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">
				Dropdown menus in common patterns and real-world use cases.
			</p>
		</div>

		<!-- Basic menu -->
		<div id="basic-menu" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Basic menu
			</h3>
			<ComponentPreview code={BasicMenuSrc}>
				<BasicMenu />
			</ComponentPreview>
		</div>

		<!-- Row actions -->
		<div id="row-actions" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Row actions
			</h3>
			<ComponentPreview code={RowActionsSrc}>
				<RowActions />
			</ComponentPreview>
		</div>

		<!-- Share menu -->
		<div id="share-menu" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Share menu
			</h3>
			<ComponentPreview code={ShareMenuSrc}>
				<ShareMenu />
			</ComponentPreview>
		</div>

		<!-- Sort menu -->
		<div id="sort-menu" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Sort menu
			</h3>
			<ComponentPreview code={SortMenuSrc}>
				<SortMenu />
			</ComponentPreview>
		</div>

		<!-- Inverted menu -->
		<div id="inverted-menu" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Inverted menu
			</h3>
			<p class="text-sm text-foreground-muted">
				A dark-themed dropdown with inverted colors. Use `inverted` prop on Root.
			</p>
			<ComponentPreview code={InvertedSrc}>
				<Inverted />
			</ComponentPreview>
		</div>
	</section>

	<!-- ─── API Reference ─────────────────────────────────────────── -->
	<section id="api" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			API Reference
		</h2>
		<p class="text-sm text-foreground-muted">
			Compose Dropdown Menu with Root, Trigger, Content, Label, Item, Separator, and Sub
			sub-components.
		</p>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<div
				class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 border-b border-border bg-secondary/40 px-4 py-2.5 text-[0.7rem] font-[var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted max-md:hidden"
			>
				<span>Prop</span>
				<span>Type</span>
				<span class="text-right">Default</span>
			</div>
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row, i (i)}
					<li class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => copy(`DropdownMenu.${row.component}`, `prop-${row.component}`)}
								class="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
							>
								<code
									class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
								>
									DropdownMenu.{row.component}
								</code>
								{#if copiedSnippet === `prop-${row.component}`}
									<Check size={11} class="text-[var(--color-success)]" />
								{:else}
									<Copy
										size={11}
										class="text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100"
									/>
								{/if}
							</button>
						</div>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
							>
								{row.type}
							</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">
								{row.description}
							</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem] text-foreground"
							>
								{row.default}
							</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- ─── Footer ────────────────────────────────────────────────── -->
	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] font-[var(--font-weight-label,500)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Dropdown Menu token lives in the studio — restyle it for your brand in seconds.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="ghost" href={SOURCE}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="size-3.5 fill-current">
					<path
						d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.06.79 2.14v3.17c0 .31.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
					/>
				</svg>
				View source
				<External size={11} class="text-foreground-muted" />
			</Button>
			<Button href="/themes/studio">
				Open studio
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>

	<!-- ─── Prev / Next ───────────────────────────────────────────── -->
	{#if curIndex !== -1}
		<nav
			class="mt-12 flex w-full items-center"
			class:justify-between={prevComponent && nextComponent}
			class:justify-end={!prevComponent && nextComponent}
			class:justify-start={prevComponent && !nextComponent}
		>
			{#if prevComponent}
				<Button href={`/docs/components/${prevComponent}`} variant="outline" class="flex-shrink-0">
					<ChevronLeft size={16} />
					{sanitizeComponent(prevComponent)}
				</Button>
			{/if}
			{#if prevComponent && nextComponent}
				<div class="mx-4 w-full rounded-lg border-t border-border"></div>
			{/if}
			{#if nextComponent}
				<Button href={`/docs/components/${nextComponent}`} variant="outline" class="flex-shrink-0">
					{sanitizeComponent(nextComponent)}
					<ChevronRight size={16} />
				</Button>
			{/if}
		</nav>
	{/if}
</div>
