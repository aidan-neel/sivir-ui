<script lang="ts">
	import { Button, type ButtonVariant } from '@silk/ui/components/button';
	import { ComponentPreview, Steps } from '$lib/components/docs';
	import { highlight } from '$lib/highlight';
	import * as Tabs from '@silk/ui/components/tabs';
	import * as Tooltip from '@silk/ui/components/tooltip';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Send from '@lucide/svelte/icons/send';
	import Download from '@lucide/svelte/icons/download';
	import Loader from '@lucide/svelte/icons/loader-circle';
	import Heart from '@lucide/svelte/icons/heart';
	import External from '@lucide/svelte/icons/external-link';
	import Hash from '@lucide/svelte/icons/hash';
	import { components, sanitizeComponent } from '$lib/components';

	const TITLE = 'Button';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/button';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	// ── State ────────────────────────────────────────────────────────
	let copiedSnippet = $state<string | null>(null);

	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add button';
	const heroCode = '<Button>Get started</Button>';

	// ── Variant metadata ────────────────────────────────────────────
	const variantList: { value: ButtonVariant; label: string; tone: string; use: string }[] = [
		{
			value: 'primary',
			label: 'Primary',
			tone: 'The hero action',
			use: 'One per surface. Hits the eye first.'
		},
		{
			value: 'secondary',
			label: 'Secondary',
			tone: 'Quiet partner',
			use: 'Pairs with Primary when you need two equally valid choices.'
		},
		{
			value: 'outline',
			label: 'Outline',
			tone: 'Neutral container',
			use: 'Toolbar actions, in-line controls, anything that should defer to content.'
		},
		{
			value: 'ghost',
			label: 'Ghost',
			tone: 'Invisible until hovered',
			use: 'Dense menus, icon buttons, anywhere chrome should disappear.'
		},
		{
			value: 'destructive',
			label: 'Destructive',
			tone: 'Irreversible',
			use: '"Delete account", "Erase data" -- the actions you want users to pause on.'
		}
	];

	type Size = 'sm' | 'md' | 'lg' | 'icon';

	const sizeList: { value: Size; label: string; height: string; padX: string; usage: string }[] = [
		{
			value: 'sm',
			label: 'sm',
			height: '32 px',
			padX: '10 px',
			usage: 'Toolbars, dense tables, inline filters.'
		},
		{
			value: 'md',
			label: 'md',
			height: '36 px',
			padX: '12 px',
			usage: 'Forms, dialogs, page CTAs.'
		},
		{
			value: 'lg',
			label: 'lg',
			height: '40 px',
			padX: '16 px',
			usage: 'Marketing pages and high-emphasis flows.'
		},
		{
			value: 'icon',
			label: 'icon',
			height: '36 px',
			padX: '0 px',
			usage: 'Square, content-less affordances.'
		}
	];

	const apiRows = [
		{
			prop: 'variant',
			type: '"primary" | "secondary" | "outlined" | "flat" | "ghost" | "alternate" | "success" | "warning" | "error" | "destructive"',
			default: '"primary"',
			description: 'Visual treatment. See Variants for guidance.'
		},
		{
			prop: 'size',
			type: '"sm" | "default" | "lg" | "icon"',
			default: '"default"',
			description: 'Token-driven height and padding.'
		},
		{
			prop: 'href',
			type: 'string',
			default: '--',
			description: 'Renders an `<a>` instead of a `<button>` -- same styling, semantic anchor.'
		},
		{
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Pointer + keyboard activation.'
		},
		{
			prop: 'element',
			type: 'HTMLButtonElement | HTMLAnchorElement | undefined',
			default: '--',
			description: 'Bindable reference for imperative focus / measurement.'
		},
		{
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Standard disabled -- also disables hover / focus shadows.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes appended via `cn()` -- overrides win.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Button</title>
	<meta
		name="description"
		content="Displays a button or a component that looks like a button. Ten variants, four sizes, polymorphic href."
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
				Button
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				The most touched piece of UI in your product. Silk's Button is built around semantic intent
				— pick a variant for what the action means, not how it should look.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={heroCode}>
			<Button>Get started</Button>
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<p class="text-sm text-foreground-muted">Install the Button component with the CLI:</p>
		<Steps
			steps={[
				{
					title: 'Run the CLI',
					description: 'Copy the command below and run it in your terminal.'
				}
			]}
		>
			<div
				class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
			>
				<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
					<span
						class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"
					>
						<Hash size={12} />
					</span>
					<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
				</div>
				<button
					type="button"
					onclick={() => copy(installCommand, 'install')}
					class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
					aria-label="Copy install command"
				>
					{#if copiedSnippet === 'install'}
						<Check size={14} class="text-[var(--color-success)]" />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			</div>
		</Steps>
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">Import the Button and use it in your component:</p>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 rounded-[var(--radius-md)] border border-border px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`import { Button } from '@silk/ui/components/button';\n\n<Button>Click me</Button>`,
					'svelte'
				)}</code
			></pre>
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
				Explore the Button in different variants, sizes, and compositions.
			</p>
		</div>

		<!-- Variants — each its own example piece -->
		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-2">
				<h3
					class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
				>
					Variants
				</h3>
				<p class="text-sm text-foreground-muted">
					Pick by intent. The same action should always use the same variant across your product.
				</p>
			</div>
			{#each variantList as v (v.value)}
				{@const code = `<Button${v.value !== 'primary' ? ` variant="${v.value}"` : ''}>${v.label}</Button>`}
				<div class="flex flex-col gap-2.5">
					<p class="text-[0.82rem] font-[var(--font-weight-label,500)] text-foreground-muted">
						{v.label}
					</p>
					<ComponentPreview {code}>
						<Button variant={v.value}>{v.label}</Button>
					</ComponentPreview>
				</div>
			{/each}
		</div>

		<!-- Sizes -->
		<div class="flex flex-col gap-4">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Sizes
			</h3>
			<p class="text-sm text-foreground-muted">
				Four sizes on a 4-unit baseline. Pick the smallest size that still feels clickable.
			</p>
			<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
				<div
					class="flex flex-wrap items-end justify-around gap-5 border-b border-border/70 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-secondary)_45%,transparent))] px-6 py-8"
				>
					{#each sizeList as s (s.value)}
						<div class="flex flex-col items-center gap-2">
							<Button size={s.value} variant="primary">
								{#if s.value === 'icon'}
									<Heart size={14} />
								{:else}
									{s.label}
								{/if}
							</Button>
							<span class="font-mono text-[0.7rem] text-foreground-muted">{s.label}</span>
						</div>
					{/each}
				</div>
				<div
					class="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0"
				>
					{#each sizeList as s (s.value)}
						<div class="flex flex-col gap-1 p-4">
							<p
								class="m-0 font-mono text-[0.78rem] font-[var(--font-weight-label,600)] tracking-tight"
							>
								{s.label}
							</p>
							<div class="flex items-center gap-3 text-[0.72rem] text-foreground-muted">
								<span class="font-mono">{s.height}</span>
								<span aria-hidden="true">·</span>
								<span class="font-mono">{s.padX}</span>
							</div>
							<p class="m-0 mt-1 text-[0.74rem] leading-snug text-foreground-muted">
								{s.usage}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- States -->
		<div class="flex flex-col gap-4">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				States
			</h3>
			<p class="text-sm text-foreground-muted">
				All transitions are tied to your theme's motion preset.
			</p>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{#each [{ label: 'Resting', node: 'rest' }, { label: 'Hover', node: 'hover' }, { label: 'Focus', node: 'focus' }, { label: 'Active', node: 'active' }, { label: 'Disabled', node: 'disabled' }] as s (s.node)}
					<div
						class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
					>
						<div class="grid min-h-[4.5rem] place-items-center">
							{#if s.node === 'disabled'}
								<Button disabled>Disabled</Button>
							{:else if s.node === 'focus'}
								<Button class="ring-[3px] ring-[var(--color-ring)]">Focus</Button>
							{:else if s.node === 'active'}
								<Button class="translate-y-px">Active</Button>
							{:else if s.node === 'hover'}
								<Button class="brightness-110">Hover</Button>
							{:else}
								<Button>Rest</Button>
							{/if}
						</div>
						<span class="text-[0.74rem] font-[var(--font-weight-label,500)] text-foreground-muted"
							>{s.label}</span
						>
					</div>
				{/each}
			</div>
		</div>

		<!-- Composition -->
		<div class="flex flex-col gap-4">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Composition
			</h3>
			<p class="text-sm text-foreground-muted">
				Patterns we use in production. Copy any of these as a starting point.
			</p>

			<Tabs.Root value="leading" variant="outlined">
				<Tabs.List>
					<Tabs.Trigger value="leading">Leading icon</Tabs.Trigger>
					<Tabs.Trigger value="trailing">Trailing icon</Tabs.Trigger>
					<Tabs.Trigger value="loading">Loading</Tabs.Trigger>
					<Tabs.Trigger value="link">As link</Tabs.Trigger>
					<Tabs.Trigger value="group">Group</Tabs.Trigger>
				</Tabs.List>

				<div class="mt-3 grid gap-3 md:grid-cols-2">
					<Tabs.Content value="leading" class="contents">
						<div
							class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
						>
							<Button>
								<Plus size={14} />
								New project
							</Button>
						</div>
						<pre
							class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
								>{@html highlight(
									`<Button>
  <Plus size={14} />
  New project
</Button>`,
									'svelte'
								)}</code
							></pre>
					</Tabs.Content>

					<Tabs.Content value="trailing" class="contents">
						<div
							class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
						>
							<Button variant="secondary">
								Continue
								<ArrowRight size={14} />
							</Button>
						</div>
						<pre
							class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
								>{@html highlight(
									`<Button variant="secondary">
  Continue
  <ArrowRight size={14} />
</Button>`,
									'svelte'
								)}</code
							></pre>
					</Tabs.Content>

					<Tabs.Content value="loading" class="contents">
						<div
							class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
						>
							<Button disabled>
								<Loader size={14} class="animate-spin" />
								Saving…
							</Button>
						</div>
						<pre
							class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
								>{@html highlight(
									`<Button disabled={busy}>
  {#if busy}
    <Loader size={14} class="animate-spin" />
    Saving…
  {:else}
    Save
  {/if}
</Button>`,
									'svelte'
								)}</code
							></pre>
					</Tabs.Content>

					<Tabs.Content value="link" class="contents">
						<div
							class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
						>
							<Button href="https://silk.dev" variant="outline">
								<External size={13} />
								Open docs
							</Button>
						</div>
						<pre
							class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
								>{@html highlight(
									`<Button href="/docs" variant="outline">
  <External size={13} />
  Open docs
</Button>`,
									'svelte'
								)}</code
							></pre>
					</Tabs.Content>

					<Tabs.Content value="group" class="contents">
						<div
							class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
						>
							<div class="flex items-center gap-2">
								<Button variant="ghost"><Download size={14} /></Button>
								<Button variant="ghost"><Send size={14} /></Button>
								<Button variant="ghost"><Trash size={14} /></Button>
							</div>
						</div>
						<pre
							class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
								>{@html highlight(
									`<div class="flex items-center gap-2">
  <Button variant="ghost"><Download size={14} /></Button>
  <Button variant="ghost"><Send size={14} /></Button>
  <Button variant="ghost"><Trash size={14} /></Button>
</div>`,
									'svelte'
								)}</code
							></pre>
					</Tabs.Content>
				</div>
			</Tabs.Root>
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
			<code class="font-mono text-foreground">Button</code> is the only export. Every prop accepts the
			underlying button/anchor attributes too.
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
								onclick={() => copy(row.prop, `prop-${row.prop}`)}
								class="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
							>
								<code
									class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
								>
									{row.prop}
								</code>
								{#if copiedSnippet === `prop-${row.prop}`}
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
				Every Button token lives in the studio — restyle it for your brand in seconds.
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
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="outline" href="/themes">
						<Layers size={14} />
						Browse themes
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Community-published presets</Tooltip.Content>
			</Tooltip.Root>
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
