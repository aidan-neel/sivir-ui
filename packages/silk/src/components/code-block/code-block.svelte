<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { setContext } from 'svelte';
	import * as Tabs from '@silk/ui/components/tabs';
	import { PANEL_FRAME, PANEL_SURFACE } from '../panel';
	import '../panel/panel.css';
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
		PANEL_FRAME,
		'cb-root panel-root flex w-full flex-col overflow-hidden text-[var(--panel-fg)]'
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
				<div class={cn(PANEL_SURFACE, 'cb-bodies relative w-full overflow-hidden')}>
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
	/* The surface (bg/border/fg) comes from Panel's `--panel-*` tokens (see
	   ../panel/panel.css). Only the code-specific tokens live here: the gutter,
	   code padding/leading, the tab-swap slide, and the syntax palette — light
	   defaults below, dark overrides further down. Override any `--code-block-*`
	   var from a theme to restyle the code. */
	.cb-root {
		--code-block-gutter: var(--color-foreground-muted);

		--code-block-padding-x: 1.1rem;
		--code-block-padding-y: 0.9rem;
		--code-block-line-height: 1.7;
		/* Horizontal travel of the directional tab-swap slide. */
		--code-block-slide: 1.25rem;

		/* Light palette — muted grayscale (matches the docs syntax theme). */
		--code-block-token-comment: #b0b0b0;
		--code-block-token-keyword: #565656;
		--code-block-token-string: #565656;
		--code-block-token-number: #868686;
		--code-block-token-function: #565656;
		--code-block-token-property: #868686;
		--code-block-token-builtin: #868686;
		--code-block-token-meta: #868686;
	}

	/* Dark palette (muted VS Code dark), applied under a `.dark` ancestor. */
	:global(.dark) .cb-root {
		--code-block-token-comment: #a0a0a0;
		--code-block-token-keyword: #7ec4ff;
		--code-block-token-string: #ffc966;
		--code-block-token-number: #ffc966;
		--code-block-token-function: #7ec4ff;
		--code-block-token-property: #7ec4ff;
		--code-block-token-builtin: #7ec4ff;
		--code-block-token-meta: #a0a0a0;
	}
</style>
