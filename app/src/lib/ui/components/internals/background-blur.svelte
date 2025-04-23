<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	const {
		children,
		open,
		...rest
	}: {
		children: Snippet;
		open: boolean;
	} = $props();
</script>

{#if open}
	<div
		{...rest}
		transition:fade={{ duration: 150 }}
		class="fixed top-0 z-50 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-sm"
	>
		{@render children?.()}
	</div>
{/if}
