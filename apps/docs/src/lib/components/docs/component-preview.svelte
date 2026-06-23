<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import * as CodeBlock from '@silk/ui/components/code-block';
	import { Panel } from '@silk/ui/components/panel';
	import { cn } from '@silk/ui/utils';
	import * as Tabs from '@silk/ui/components/tabs';

	let {
		children,
		code,
		class: classProp,
		...rest
	}: {
		children?: Snippet;
		code: string;
		class?: string;
	} = $props();

	let value = $state<string>('preview');
	let previewBody = $state<HTMLElement>();

	onMount(() => {
		// Drop initial focus into the first preview on the page so the user can
		// Tab straight into the demo instead of walking through the chrome first.
		if (
			previewBody &&
			previewBody.closest('[data-component-preview]') ===
				document.querySelector('[data-component-preview]')
		) {
			previewBody.focus({ preventScroll: true });
		}
	});
</script>

<div class="flex flex-col gap-3.5" data-component-preview>
	<!-- Tabs (using library Tabs component; segmented = pill-on-track switcher) -->
	<Tabs.Root bind:value variant="segmented">
		<Tabs.List class="w-fit">
			<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			<Tabs.Trigger value="code">Code</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Frame: a Panel (concentric border). Its fill sits a hair darker than the
	     card-coloured inner surface, so the demo/code reads as a distinct inset. -->
	<Panel
		{...rest}
		class={cn(
			classProp,
			'w-full flex flex-col max-h-[40rem] p-2',
			'bg-[color-mix(in_srgb,var(--color-card)_97%,var(--color-foreground))]',
			value === 'preview' ? 'overflow-hidden' : 'overflow-auto relative'
		)}
	>
		<div
			bind:this={previewBody}
			tabindex="-1"
			class={cn(
				'w-full rounded-[var(--radius-md)] bg-card focus:outline-none',
				value === 'preview'
					? 'min-h-[20rem] flex items-center justify-center overflow-hidden p-10'
					: 'relative'
			)}
		>
			{#if value === 'preview'}
				{@render children?.()}
			{:else}
				<CodeBlock.Root value="code" class="w-full border-none bg-transparent shadow-none">
					<CodeBlock.Content value="code" {code} lang="svelte" copyPlacement="overlay" />
				</CodeBlock.Root>
			{/if}
		</div>
	</Panel>
</div>

<style>
	/* Inside the preview the Panel frame already supplies the border, so drop the
	   CodeBlock's own interior ring + drop shadow — it would double up otherwise. */
	:global([data-component-preview] [data-ui='code-block-content']) {
		box-shadow: none;
		background: transparent;
	}
</style>
