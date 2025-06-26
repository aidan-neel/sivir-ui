<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { scaleFade } from '$lib/ui/internals/transition';
    import { STATE_KEY } from '.';

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

<label
	{...rest}
	class={cn(classProp, `flex flex-row items-center gap-2`)}
	id={`${String(STATE_KEY)}-controls`}
>
	<input
		type="checkbox"
		class="peer hidden"
		bind:checked
		role="checkbox"
		aria-checked={checked}
		aria-labelledby={`${String(STATE_KEY)}-controls-label`}
	/>
	{#if checked}
		<div
			in:scaleFade={{ duration: 100 }}
			class="bg-primary p-0 h-4 w-4 flex items-center justify-center rounded-sm"
		>
			<Check size="12" class="text-foreground-btn" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 100 }}
			class="bg-background border p-0 flex items-center justify-center h-4 w-4 rounded-sm"
		></div>
	{/if}
	{#if label}
		<span id={`${String(STATE_KEY)}-controls-label`} class="text-text text-sm font-medium">
			{label}
		</span>
	{/if}
</label>

