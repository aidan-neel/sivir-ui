<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@silk/ui/components/code-block';
	import { Button } from '@silk/ui/components/button';
	import * as Tooltip from '@silk/ui/components/tooltip';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import External from '@lucide/svelte/icons/external-link';
	import { components, sanitizeComponent } from '$lib/components';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import Single from './examples/single.svelte';
	import SingleSrc from './examples/single.svelte?raw';
	import MultiLanguage from './examples/multi-language.svelte';
	import MultiLanguageSrc from './examples/multi-language.svelte?raw';
	import LineNumbers from './examples/line-numbers.svelte';
	import LineNumbersSrc from './examples/line-numbers.svelte?raw';
	import Compound from './examples/compound.svelte';
	import CompoundSrc from './examples/compound.svelte?raw';
	import CustomActions from './examples/custom-actions.svelte';
	import CustomActionsSrc from './examples/custom-actions.svelte?raw';
	import CopyOverlay from './examples/copy-overlay.svelte';
	import CopyOverlaySrc from './examples/copy-overlay.svelte?raw';
	import CopyInline from './examples/copy-inline.svelte';
	import CopyInlineSrc from './examples/copy-inline.svelte?raw';

	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/code-block';

	const curIndex = components.indexOf('code-block');
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	let copiedSnippet = $state<string | null>(null);

	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add code-block';

	const usageSnippet = `import { CodeBlock } from '@silk/ui/components/code-block';

<CodeBlock
  value="javascript"
  tabs={[
    { label: 'Python',     lang: 'python',     code: pyCode },
    { label: 'JavaScript', lang: 'javascript', code: jsCode },
  ]}
/>`;

	const apiRows = [
		{
			prop: 'tabs',
			type: '{ label: string; lang: string; code: string; value?: string }[]',
			default: '--',
			description: 'Multi-language form. Each entry becomes a tab + panel.'
		},
		{
			prop: 'code',
			type: 'string',
			default: '--',
			description: 'Single-snippet shorthand. Ignored when `tabs` is set.'
		},
		{
			prop: 'lang',
			type: 'string',
			default: '--',
			description: 'highlight.js language id/alias for the single snippet (e.g. "ts", "py", "c#").'
		},
		{
			prop: 'value',
			type: 'string',
			default: 'first tab',
			description: 'Active tab id (bindable). Defaults to the first tab.'
		},
		{
			prop: 'showLineNumbers',
			type: 'boolean',
			default: 'false',
			description: 'Render a line-number gutter.'
		},
		{
			prop: 'copy',
			type: '"actionbar" | "overlay" | "inline"',
			default: '"actionbar"',
			description:
				'Copy button placement. `overlay` pins it to the body top-right; `inline` makes a single-line body with the copy centered on the far right.'
		},
		{
			prop: 'actions',
			type: 'Snippet',
			default: '--',
			description: 'Extra buttons rendered left of the built-in copy button.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes appended via `cn()` -- overrides win.'
		}
	];

	const parts = [
		{
			name: 'CodeBlock.Root',
			desc: 'Container + active-tab state (built on Silk Tabs). Doubles as the high-level <CodeBlock>.'
		},
		{ name: 'CodeBlock.Header', desc: 'Top bar. The tab List flows left; Actions pins right.' },
		{
			name: 'CodeBlock.List',
			desc: 'Wraps the triggers — renders the active indicator and handles keyboard nav.'
		},
		{ name: 'CodeBlock.Trigger', desc: 'A language tab. Prop: `value` (matches a Content).' },
		{
			name: 'CodeBlock.Actions',
			desc: 'Right-side action cluster. Appends the copy button unless `copy={false}`.'
		},
		{ name: 'CodeBlock.Copy', desc: 'Copy button wired to the active tab’s raw code.' },
		{
			name: 'CodeBlock.Content',
			desc: 'Highlighted panel for a `value`. Props: `code`, `lang`, `showLineNumbers`.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Code Block</title>
	<meta
		name="description"
		content="Syntax-highlighted code block with a multi-language tab switcher, copy button, and an actions slot. Highlighting via highlight.js."
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
				Code Block
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				Present source code with real syntax highlighting, a language tab switcher, and a built-in
				copy button. Powered by highlight.js — synchronous, SSR-safe, and themable down to each
				token color.
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
		<p class="text-sm text-foreground-muted">
			The component depends on <code class="font-mono text-foreground">highlight.js</code>. Install
			it if your project doesn't have it yet:
		</p>
		<InstallCommand command="bun add highlight.js" />
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">
			Pass a <code class="font-mono text-foreground">tabs</code> array for the multi-language form,
			or
			<code class="font-mono text-foreground">code</code> +
			<code class="font-mono text-foreground">lang</code> for a single snippet:
		</p>
		<CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
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
				From a single highlighted snippet to fully composed, multi-language blocks.
			</p>
		</div>

		<div id="single" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Single snippet
			</h3>
			<ComponentPreview code={SingleSrc}>
				<Single />
			</ComponentPreview>
		</div>

		<div id="multi-language" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Multiple languages
			</h3>
			<ComponentPreview code={MultiLanguageSrc}>
				<MultiLanguage />
			</ComponentPreview>
		</div>

		<div id="line-numbers" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Line numbers
			</h3>
			<ComponentPreview code={LineNumbersSrc}>
				<LineNumbers />
			</ComponentPreview>
		</div>

		<div id="custom-actions" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Custom actions
			</h3>
			<ComponentPreview code={CustomActionsSrc}>
				<CustomActions />
			</ComponentPreview>
		</div>

		<div id="copy-overlay" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Copy placement — overlay
			</h3>
			<ComponentPreview code={CopyOverlaySrc}>
				<CopyOverlay />
			</ComponentPreview>
		</div>

		<div id="copy-inline" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Copy placement — inline
			</h3>
			<ComponentPreview code={CopyInlineSrc}>
				<CopyInline />
			</ComponentPreview>
		</div>

		<div id="compound" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Compound API
			</h3>
			<ComponentPreview code={CompoundSrc}>
				<Compound />
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
			High-level <code class="font-mono text-foreground">&lt;CodeBlock&gt;</code> props:
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

		<p class="mt-2 text-sm text-foreground-muted">Compound parts:</p>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each parts as part, i (i)}
					<li class="grid grid-cols-[0.9fr_1.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<code
							class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
						>
							{part.name}
						</code>
						<p class="m-0 text-[0.8rem] leading-snug text-foreground-muted">{part.desc}</p>
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
				Every token — surface, tabs, and per-language colors — is a CSS variable. Restyle it for
				your brand in the studio.
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
