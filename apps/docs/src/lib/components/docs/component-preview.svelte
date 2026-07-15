<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import * as CodeBlock from '@sivir/ui/components/code-block';
	import { Panel } from '@sivir/ui/components/panel';
	import { cn } from '@sivir/ui/utils';
	import * as Tabs from '@sivir/ui/components/tabs';

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

	{#if value === 'preview'}
		<!-- Preview is a Panel: the demo sits on its inset surface. -->
		<Panel {...rest} class={cn(classProp, 'w-full max-h-[40rem] overflow-hidden')}>
			<div
				bind:this={previewBody}
				tabindex="-1"
				class="flex min-h-[20rem] w-full items-center justify-center overflow-hidden p-10 focus:outline-none"
			>
				{@render children?.()}
			</div>
		</Panel>
	{:else}
		<!-- Code is a CodeBlock — it carries its own Panel frame, so it stands alone. -->
		<CodeBlock.Root
			{...rest}
			{code}
			lang="svelte"
			copy="overlay"
			class={cn(classProp, 'w-full max-h-[40rem] overflow-auto')}
		/>
	{/if}
</div>
