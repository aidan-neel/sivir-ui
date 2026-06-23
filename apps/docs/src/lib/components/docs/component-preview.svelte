<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import { cn } from '@silk/ui/utils';
	import * as Tabs from '@silk/ui/components/tabs';
	import { CopyButton } from '@silk/ui/components/copy-button';

	let {
		children,
		selectedTab = 1,
		code,
		class: classProp,
		...rest
	}: {
		children?: Snippet;
		selectedTab?: number;
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

	<!-- Content -->
	<div
		{...rest}
		class={cn(
			classProp,
			`border border-border rounded-[var(--radius-lg)] bg-card w-full flex flex-col max-h-[40rem] ${
				value === 'preview'
					? 'min-h-[20rem] items-center justify-center overflow-hidden p-10'
					: 'items-stretch justify-start overflow-auto relative'
			}`
		)}
	>
		<div
			bind:this={previewBody}
			tabindex="-1"
			class={cn(classProp, 'w-full relative flex items-center justify-center focus:outline-none')}
		>
			{#if value === 'preview'}
				{@render children?.()}
			{:else}
				<CopyButton text={code} class="z-50 absolute top-3 right-3" />
				<CodeBlock class="border-none bg-transparent shadow-none" {code} />
			{/if}
		</div>
	</div>
</div>
