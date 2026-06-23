<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { getContext } from 'svelte';
	import type { TabsState } from '@silk/ui/components/tabs';
	import type { CodeBlockContentProps, CodeBlockRegistry } from '.';
	import { highlight } from './highlight';
	import Copy from './code-block-copy.svelte';

	let {
		value = 'default',
		code,
		lang,
		showLineNumbers = false,
		copyPlacement,
		class: className,
		...rest
	}: CodeBlockContentProps = $props();

	const registry = getContext<CodeBlockRegistry>('code-block');
	const tabs = getContext<TabsState>('tabs');

	// Register raw code (Copy reads the active one) and record source order so the
	// slide direction can be derived from tab position.
	$effect(() => {
		if (!registry) return;
		registry.codes[value] = code;
		if (!registry.order.includes(value)) registry.order = [...registry.order, value];
		return () => {
			delete registry.codes[value];
		};
	});

	const html = $derived(highlight(code, lang));
	const lineCount = $derived(code.replace(/\n$/, '').split('\n').length);

	const activeValue = $derived(tabs ? tabs.value : (registry?.active ?? value));
	const isActive = $derived(activeValue === value);
	const myIndex = $derived(registry ? registry.order.indexOf(value) : 0);
	const activeIndex = $derived(registry ? registry.order.indexOf(activeValue) : 0);
	// Panels left of the active one rest off to the LEFT, panels to the right rest
	// off to the RIGHT. Switching tabs slides the incoming text in from its side
	// while the outgoing text slides out the opposite way.
	const shift = $derived(isActive ? 0 : myIndex < activeIndex ? -1 : 1);

	function toIdPart(input: string) {
		return input
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}
	const panelId = $derived(tabs ? `${tabs.id}-content-${toIdPart(value)}` : undefined);
	const tabId = $derived(tabs ? `${tabs.id}-trigger-${toIdPart(value)}` : undefined);
</script>

<div
	role="tabpanel"
	id={panelId}
	aria-labelledby={tabId}
	data-ui="code-block-content"
	data-state={isActive ? 'active' : 'inactive'}
	aria-hidden={!isActive}
	inert={!isActive}
	class={cn(className, 'cb-panel', isActive ? 'cb-panel--active' : 'cb-panel--idle')}
	style:transform={`translateX(calc(${shift} * var(--code-block-slide)))`}
	style:opacity={isActive ? '1' : '0'}
	{...rest}
>
	<div class="relative w-full overflow-x-auto">
		<!-- `.cb-surface` must be a real element in this file for Svelte to scope the
		     token styles below onto the `{@html}` spans it wraps. -->
		{#if copyPlacement === 'inline'}
			<div class="cb-surface flex min-w-full items-center">
				<pre
					class="cb-code m-0 min-w-0 flex-1 overflow-x-auto whitespace-pre px-[var(--code-block-padding-x)] py-[var(--code-block-padding-y)] text-[13px] leading-[var(--code-block-line-height)]"><code
						>{@html html}</code
					></pre>
				<Copy class="mr-1.5 shrink-0" />
			</div>
		{:else}
			<div class="cb-surface flex min-w-full">
				{#if showLineNumbers}
					<pre
						aria-hidden="true"
						class="m-0 shrink-0 select-none border-r border-[var(--code-block-border)] px-3 py-[var(--code-block-padding-y)] text-right text-[13px] leading-[var(--code-block-line-height)] text-[var(--code-block-gutter)]">{#each Array.from({ length: lineCount }, (_, i) => i) as i (i)}{i +
								1}{'\n'}{/each}</pre>
				{/if}
				<pre
					class="cb-code m-0 min-w-0 flex-1 overflow-x-auto px-[var(--code-block-padding-x)] py-[var(--code-block-padding-y)] text-[13px] leading-[var(--code-block-line-height)]"><code
						>{@html html}</code
					></pre>
			</div>
		{/if}
		{#if copyPlacement === 'overlay'}
			<Copy class="absolute right-2 top-2 z-10" />
		{/if}
	</div>
</div>

<style>
	/* Standalone (compound) usage: each panel carries its own card and only the
	   active one shows. */
	.cb-panel {
		border-radius: var(--radius-md);
		background: var(--code-block-bg);
		color: var(--code-block-fg);
		font-family: var(--font-mono);
		box-shadow:
			var(--card-shadow),
			0 0 0 1px color-mix(in oklab, var(--code-block-border) 50%, transparent);
		overflow: hidden;
	}
	.cb-panel--idle {
		display: none;
	}

	/* High-level usage: the `.cb-bodies` stage IS the card. Panels are transparent
	   and absolutely stacked, so a swap slides only the TEXT (not the background)
	   — the new code slides in while the old slides out. */
	:global(.cb-bodies) .cb-panel {
		background: transparent;
		box-shadow: none;
		border-radius: 0;
		overflow: visible;
		transition:
			transform 220ms var(--ease-out),
			opacity 190ms var(--ease-out);
		will-change: transform, opacity;
	}
	:global(.cb-bodies) .cb-panel--active {
		position: relative;
		z-index: 1;
	}
	:global(.cb-bodies) .cb-panel--idle {
		display: block;
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	/* `{@html}` output isn't reachable by Svelte's scoped selectors, so token
	   colors hang off a scoped wrapper class with `:global()` descendants. Every
	   color resolves from a `--code-block-token-*` var (set per light/dark on the
	   root), so themes can override them. */
	.cb-surface :global(.hljs-comment),
	.cb-surface :global(.hljs-quote) {
		color: var(--code-block-token-comment);
		font-style: italic;
	}
	.cb-surface :global(.hljs-keyword),
	.cb-surface :global(.hljs-selector-tag),
	.cb-surface :global(.hljs-literal),
	.cb-surface :global(.hljs-section),
	.cb-surface :global(.hljs-link) {
		color: var(--code-block-token-keyword);
	}
	.cb-surface :global(.hljs-string),
	.cb-surface :global(.hljs-meta-string),
	.cb-surface :global(.hljs-regexp),
	.cb-surface :global(.hljs-template-tag) {
		color: var(--code-block-token-string);
	}
	.cb-surface :global(.hljs-number),
	.cb-surface :global(.hljs-symbol),
	.cb-surface :global(.hljs-bullet) {
		color: var(--code-block-token-number);
	}
	.cb-surface :global(.hljs-title),
	.cb-surface :global(.hljs-title.function_),
	.cb-surface :global(.hljs-function .hljs-title) {
		color: var(--code-block-token-function);
	}
	.cb-surface :global(.hljs-attr),
	.cb-surface :global(.hljs-attribute),
	.cb-surface :global(.hljs-property),
	.cb-surface :global(.hljs-variable),
	.cb-surface :global(.hljs-template-variable) {
		color: var(--code-block-token-property);
	}
	.cb-surface :global(.hljs-built_in),
	.cb-surface :global(.hljs-class .hljs-title),
	.cb-surface :global(.hljs-title.class_),
	.cb-surface :global(.hljs-type),
	.cb-surface :global(.hljs-params) {
		color: var(--code-block-token-builtin);
	}
	.cb-surface :global(.hljs-meta),
	.cb-surface :global(.hljs-meta .hljs-keyword) {
		color: var(--code-block-token-meta);
	}
	.cb-surface :global(.hljs-emphasis) {
		font-style: italic;
	}
	.cb-surface :global(.hljs-strong) {
		font-weight: 600;
	}
</style>
