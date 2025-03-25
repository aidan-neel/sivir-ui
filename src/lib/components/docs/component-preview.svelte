<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/ui/utils';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

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

	// Smooth tab indicator motion
	let indicatorX = new Tween(0, { duration: 50, easing: cubicOut });
	let indicatorRef = $state(null);

	function selectTab(tab: number, index: number) {
		selectedTab = tab;
		indicatorX.target = index * 112; // Assuming each tab button is w-28 (112px)
	}
</script>

<div
	{...rest}
	class={cn(classProp, 'w-full border rounded-lg flex flex-col overflow-auto max-w-full gap-4')}
>
	<div class="h-full bg-secondary/50 min-h-[18rem] border-b py-12 flex items-center justify-center">
		<div class="w-fit flex items-center justify-center">
			{@render children?.()}
		</div>
	</div>

	<CodeBlock {code} class="border-none rounded-lg-none rounded-lg-b py-0 px-4 pb-4" />
</div>

<!--<div {...rest} class={cn(classProp, 'w-full flex flex-col overflow-auto max-w-full gap-4')}>
	<div class="relative w-full flex flex-row">
		<button onclick={() => selectTab(1, 0)} class="p-3 w-28 text-center"> Preview </button>
		<button onclick={() => selectTab(2, 1)} class="p-3 w-28 text-center"> Code </button>

		<div
			bind:this={indicatorRef}
			class="absolute bottom-0 h-0.5 w-28 bg-black rounded-lg-full"
			style="transform: translateX({indicatorX.current}px); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
		></div>
	</div>

	<div
		class="flex items-center justify-center overflow-auto {selectedTab === 1
			? 'min-h-[18rem] py-16 border rounded-lg '
			: ''}"
	>
		{#if selectedTab === 1}
			<div in:fade={{ duration: 100 }}>
				{@render children?.()}
			</div>
		{:else if selectedTab === 2}
			<CodeBlock {code} />
		{/if}
	</div>
</div>
-->
