<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import * as HoverCard from '@silk/ui/components/hover-card';
	import * as Avatar from '@silk/ui/components/avatar';
	import { ComponentPreview, Steps } from '$lib/components/docs';
	import { highlight } from '$lib/highlight';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';

	const _TITLE = 'Hover Card';
	const SLUG = 'hover-card';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;

	const curIndex = components.indexOf(SLUG);
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{
			component: 'Root',
			prop: 'openDelay',
			type: 'number (ms)',
			default: '200',
			description: 'Time the cursor must rest on the trigger before opening.'
		},
		{
			component: 'Root',
			prop: 'closeDelay',
			type: 'number (ms)',
			default: '150',
			description: 'Time the cursor must leave before closing.'
		},
		{
			component: 'Trigger',
			prop: 'href',
			type: 'string',
			default: '--',
			description: 'Renders as an anchor when set; falls back to a focusable span.'
		},
		{
			component: 'Content',
			prop: 'side / align',
			type: 'placement',
			default: '"bottom" / "center"',
			description: 'Floating-UI placement.'
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

	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;
	const heroCode = `<HoverCard.Root>
	  <HoverCard.Trigger>@aidan-neel</HoverCard.Trigger>
	  <HoverCard.Content>
	    <div class="flex items-start gap-3">
	      <Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
	      <div class="flex flex-col gap-1">
	        <HoverCard.Title>Aidan Neel</HoverCard.Title>
	        <HoverCard.Description>Building Silk. Loves type-driven design and animation polish.</HoverCard.Description>
	      </div>
	    </div>
	  </HoverCard.Content>
	</HoverCard.Root>`;
</script>

<svelte:head>
	<title>Silk · Hover Card</title>
	<meta
		name="description"
		content="A preview card that opens on hover or keyboard focus. Use it for user mentions, link previews, or definitions."
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
				Hover Card
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A preview card that opens on hover or keyboard focus. Use it for user mentions, link
				previews, or definitions.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={heroCode}>
			<p class="text-[0.92rem] text-foreground-muted">
				Built by
				<HoverCard.Root>
					<HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
					<HoverCard.Content>
						<div class="flex items-start gap-3">
							<Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<div class="flex flex-col gap-1">
								<HoverCard.Title>Aidan Neel</HoverCard.Title>
								<HoverCard.Description
									>Building Silk. Loves type-driven design and animation polish.</HoverCard.Description
								>
							</div>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
				— hover the username for a preview.
			</p>
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<p class="text-sm text-foreground-muted">Install the Hover Card component with the CLI:</p>
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
		<p class="text-sm text-foreground-muted">
			Import Hover Card and compose it with sub-components:
		</p>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 rounded-[var(--radius-md)] border border-border px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`import * as HoverCard from '@silk/ui/components/hover-card';\nimport * as Avatar from '@silk/ui/components/avatar';\n\n<HoverCard.Root>\n  <HoverCard.Trigger>@username</HoverCard.Trigger>\n  <HoverCard.Content>\n    <HoverCard.Title>Full name</HoverCard.Title>\n    <HoverCard.Description>Bio or description</HoverCard.Description>\n  </HoverCard.Content>\n</HoverCard.Root>`,
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
				Explore Hover Card in different compositions and use cases.
			</p>
		</div>

		<!-- User mention preview -->
		<div id="user-preview" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				User mention preview
			</h3>
			<ComponentPreview code={heroCode}>
				<p class="text-[0.92rem] text-foreground-muted">
					Built by
					<HoverCard.Root>
						<HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
						<HoverCard.Content>
							<div class="flex items-start gap-3">
								<Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
								<div class="flex flex-col gap-1">
									<HoverCard.Title>Aidan Neel</HoverCard.Title>
									<HoverCard.Description
										>Building Silk. Loves type-driven design and animation polish.</HoverCard.Description
									>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
					— hover the username for a preview.
				</p>
			</ComponentPreview>
		</div>

		<!-- Link preview -->
		<div id="link-preview" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Link preview
			</h3>
			<ComponentPreview
				code={`<HoverCard.Root>
	  <HoverCard.Trigger href="https://silk.dev">Silk UI</HoverCard.Trigger>
	  <HoverCard.Content>
	    <HoverCard.Title>Silk UI</HoverCard.Title>
	    <HoverCard.Description>An unstyled, accessible Svelte component library.</HoverCard.Description>
	  </HoverCard.Content>
	</HoverCard.Root>`}
			>
				<HoverCard.Root>
					<HoverCard.Trigger href="https://silk.dev">Silk UI</HoverCard.Trigger>
					<HoverCard.Content>
						<HoverCard.Title>Silk UI</HoverCard.Title>
						<HoverCard.Description
							>An unstyled, accessible Svelte component library.</HoverCard.Description
						>
					</HoverCard.Content>
				</HoverCard.Root>
			</ComponentPreview>
		</div>

		<!-- Simple definition -->
		<div id="definition" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Definition or term
			</h3>
			<ComponentPreview
				code={`<HoverCard.Root>
	  <HoverCard.Trigger>polymorphic</HoverCard.Trigger>
	  <HoverCard.Content>
	    <HoverCard.Description>Able to render as different HTML elements while maintaining the same component API.</HoverCard.Description>
	  </HoverCard.Content>
	</HoverCard.Root>`}
			>
				<HoverCard.Root>
					<HoverCard.Trigger>polymorphic</HoverCard.Trigger>
					<HoverCard.Content>
						<HoverCard.Description
							>Able to render as different HTML elements while maintaining the same component API.</HoverCard.Description
						>
					</HoverCard.Content>
				</HoverCard.Root>
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
			Compose Hover Card with Root, Trigger, Content, Title, and Description sub-components.
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
								onclick={() => copy(`HoverCard.${row.component}`, `prop-${row.component}`)}
								class="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
							>
								<div class="flex flex-col gap-0.5">
									<code class="font-mono text-[0.7rem] text-foreground-muted">
										HoverCard.{row.component}
									</code>
									<code
										class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
									>
										{row.prop}
									</code>
								</div>
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
				Every Silk component reads from your theme tokens — open the studio to restyle them.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="outline" href={SOURCE}>
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
