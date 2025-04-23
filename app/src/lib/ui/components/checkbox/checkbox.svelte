<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { fade } from 'svelte/transition';
	import { scaleFade } from '$lib/ui/internals/transition';

	let {
		checked = $bindable<boolean>(),
		label,
		class: classProp,
		...rest
	}: {
		checked: boolean;
		label?: string;
		class?: string;
	} = $props();
</script>

<label {...rest} class={cn(classProp, `flex flex-row items-center gap-2`)}>
	<input type="checkbox" class="peer hidden" bind:checked />
	{#if checked}
		<div
			in:scaleFade={{ duration: 250 }}
			class="bg-primary p-0 h-4 w-4 flex items-center justify-center rounded-lg-sm"
		>
			<Check size="12" class="text-foreground-opposite" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 250 }}
			class="bg-background border p-0 flex items-center justify-center h-4 w-4 rounded-lg-sm"
		></div>
	{/if}
	{#if label}
		<span class="text-text text-sm font-medium">{label}</span>
	{/if}
</label>
