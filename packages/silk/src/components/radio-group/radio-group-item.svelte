<script lang="ts">
	import { getContext } from 'svelte';
	import { cn } from '@silk/ui/utils';
	import type { RadioGroupItemProps, RadioGroupContext } from '.';

	let {
		class: className,
		value,
		disabled,
		label,
		description,
		id,
		...rest
	}: RadioGroupItemProps = $props();

	const ctx = getContext<RadioGroupContext>('radio-group');
	const selected = $derived(ctx.isSelected(value));
	const isDisabled = $derived(disabled || ctx.disabled);
	const inputId = $derived(id ?? `radio-${value}`);
</script>

<label
	for={inputId}
	class={cn(
		'flex cursor-[var(--ui-cursor-interactive)] items-start gap-2.5',
		isDisabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	<span
		data-ui="radio-group-item"
		data-state={selected ? 'checked' : 'unchecked'}
		class={cn(
			'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-[border-color,box-shadow,transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] active:scale-[var(--motion-press-scale)] focus-visible:shadow-[var(--focus-ring)]',
			selected && 'border-primary',
			!isDisabled && 'hover:border-primary'
		)}
	>
		{#if selected}
			<span class="size-2 rounded-full bg-primary"></span>
		{/if}
	</span>
	<input
		type="radio"
		id={inputId}
		name={ctx.name}
		{value}
		checked={selected}
		disabled={isDisabled}
		onchange={() => ctx.setValue(value)}
		class="sr-only"
		{...rest}
	/>
	{#if label || description}
		<span class="flex flex-col gap-0.5 leading-tight">
			{#if label}
				<span
					class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
					>{label}</span
				>
			{/if}
			{#if description}
				<span
					class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
					>{description}</span
				>
			{/if}
		</span>
	{/if}
</label>
