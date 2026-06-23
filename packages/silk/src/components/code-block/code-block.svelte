<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { setContext } from 'svelte';
	import * as Tabs from '@silk/ui/components/tabs';
	import type { CodeBlockProps, CodeBlockRegistry, CodeBlockTab } from '.';
	import Header from './code-block-header.svelte';
	import List from './code-block-list.svelte';
	import Trigger from './code-block-trigger.svelte';
	import Actions from './code-block-actions.svelte';
	import Content from './code-block-content.svelte';

	let {
		children,
		class: className,
		value = $bindable(),
		tabs,
		code,
		lang,
		showLineNumbers = false,
		copy = 'actionbar',
		actions,
		...rest
	}: CodeBlockProps = $props();

	const SINGLE = '__single__';

	// High-level when `tabs` (multi-language) or `code` (single snippet) is given;
	// otherwise the caller composes the subparts as children.
	const resolvedTabs = $derived<CodeBlockTab[]>(
		(tabs ?? []).map((t) => ({ ...t, value: t.value ?? t.lang }))
	);
	const isHighLevel = $derived(tabs != null || code != null);
	const hasTabRow = $derived(resolvedTabs.length > 0);
	const bodyCopy = $derived<'overlay' | 'inline' | undefined>(
		copy === 'actionbar' ? undefined : copy
	);

	// Seed the active tab before the first render (from raw props, since the
	// derived above isn't ready during init).
	const firstTab = tabs?.[0];
	value ??= firstTab ? (firstTab.value ?? firstTab.lang) : code != null ? SINGLE : '';

	// Raw code per tab (Copy reads the active one) + active/order tracking that
	// drives the directional slide between tabs.
	const registry = $state({ codes: {}, active: value ?? '', order: [] } as CodeBlockRegistry);
	setContext('code-block', registry);

	$effect(() => {
		registry.active = value ?? '';
	});
</script>

<div
	data-ui="code-block"
	class={cn(
		className,
		'cb-root flex w-full flex-col p-0.5 bg-[var(--code-block-header-bg)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--code-block-border)] text-[var(--code-block-fg)] shadow-[var(--card-shadow)]'
	)}
	{...rest}
>
	<Tabs.Root bind:value variant="segmented" class="contents">
		{#if isHighLevel}
			{#if hasTabRow || actions}
				<Header>
					{#if hasTabRow}
						<List>
							{#each resolvedTabs as t (t.value)}
								<Trigger value={t.value as string}>{t.label}</Trigger>
							{/each}
						</List>
					{/if}
					<Actions copy={copy === 'actionbar'}>
						{@render actions?.()}
					</Actions>
				</Header>
			{/if}
			{#if hasTabRow || code != null}
				<!-- The static card: holds the background/ring while only the text
				     panels slide inside it (and clips the slide). -->
				<div
					class="cb-bodies relative w-full overflow-hidden rounded-md bg-[var(--code-block-bg)] shadow-[var(--card-shadow)] ring-1 ring-[color-mix(in_oklab,var(--code-block-border)_50%,transparent)]"
				>
					{#if hasTabRow}
						{#each resolvedTabs as t (t.value)}
							<Content
								value={t.value as string}
								code={t.code}
								lang={t.lang}
								{showLineNumbers}
								copyPlacement={bodyCopy}
							/>
						{/each}
					{:else if code != null}
						<Content value={SINGLE} {code} {lang} {showLineNumbers} copyPlacement={bodyCopy} />
					{/if}
				</div>
			{/if}
		{:else}
			{@render children?.()}
		{/if}
	</Tabs.Root>
</div>

<style>
	/* Surfaces reference Silk's semantic tokens, so the block follows the page's
	   light/dark theme automatically. Only the syntax (token) colors need a
	   per-mode palette — light defaults here, dark overrides below. Override any
	   `--code-block-*` var from a theme to restyle. */
	.cb-root {
		--code-block-bg: var(--color-card);
		--code-block-header-bg: color-mix(in oklab, var(--color-foreground) 3%, var(--color-card));
		--code-block-fg: var(--color-foreground);
		--code-block-border: var(--color-border);
		--code-block-gutter: var(--color-foreground-muted);

		--code-block-padding-x: 1.1rem;
		--code-block-padding-y: 0.9rem;
		--code-block-line-height: 1.7;
		/* Horizontal travel of the directional tab-swap slide. */
		--code-block-slide: 1.25rem;

		/* Light palette (GitHub-light flavoured). */
		--code-block-token-comment: #6e7781;
		--code-block-token-keyword: #cf222e;
		--code-block-token-string: #0a3069;
		--code-block-token-number: #0550ae;
		--code-block-token-function: #8250df;
		--code-block-token-property: #0550ae;
		--code-block-token-builtin: #953800;
		--code-block-token-meta: #6e7781;
	}

	/* Dark palette (muted VS Code dark), applied under a `.dark` ancestor. */
	:global(.dark) .cb-root {
		/* Softer, lower-contrast border in dark — it shouldn't draw the eye. */
		--code-block-border: color-mix(in oklab, var(--color-border) 40%, transparent);

		--code-block-token-comment: #7f9d6c;
		--code-block-token-keyword: #c58fd1;
		--code-block-token-string: #cbac84;
		--code-block-token-number: #6cb6c9;
		--code-block-token-function: #61afef;
		--code-block-token-property: #9cd0f5;
		--code-block-token-builtin: #4ec9b0;
		--code-block-token-meta: #8a8f98;
	}
</style>
