<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import Check from '@lucide/svelte/icons/check';
	import { scaleFade } from '$lib/silk/internals/transition';

	let {
		checked = $bindable<boolean>(),
		label,
        description,
        disabled,
        variant = 'default',
		class: classProp,
		...rest
	}: {
		checked: boolean;
		label?: string;
        description?: string;
        disabled?: boolean;
        variant: 'default' | 'primary';
		class?: string;
	} = $props();
</script>

<label
	{...rest}
	class={cn(
		classProp,
		`${disabled ? 'opacity-60' : ''} group ${variant === 'primary' ? 'p-4 rounded-xl border focus-within:bg-secondary hover:bg-secondary' : ''} duration-200 ${variant === 'primary' && checked === true ? 'bg-primary/10 border-primary/30 focus-within:bg-primary/20 hover:bg-primary/20' : ''} flex flex-row items-start gap-3`
	)}
>
	{#if disabled}
		<input type="checkbox" class="peer absolute opacity-0" disabled aria-checked={checked} />
	{:else}
		<input type="checkbox" class="peer absolute opacity-0" bind:checked aria-checked={checked} />
	{/if}
	{#if checked}
		<div
			in:scaleFade={{ duration: 200 }}
			class="flex h-4 w-4 items-center justify-center rounded-[var(--checkbox-radius)] bg-primary p-0 ring-offset-1 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30"
		>
			<Check size="12" class="text-foreground-btn" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 200 }}
			class="flex h-4 w-4 items-center justify-center rounded-[var(--checkbox-radius)] border bg-popover p-0 duration-200 peer-hover:bg-secondary peer-focus-visible:bg-secondary"
		></div>
	{/if}
	{#if label}
		<div class="flex flex-col justify-center">
			<span class="text-text text-sm mt-[-0.2rem] font-medium">
				{label}
			</span>
			{#if description}
				<span class="text-text text-sm text-foreground-muted">
					{description}
				</span>
			{/if}
		</div>
	{/if}
</label>
