<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/silk/utils';
	import { input } from '$lib/silk/components/input/variants';

	let {
		placeholder,
		label,
		description,
		variant = 'primary',
		class: classProp,
		element = $bindable<HTMLTextAreaElement>(),
		value = $bindable<string | number | null | undefined>(),
		...rest
	}: {
		placeholder?: string;
		label?: string;
		description?: string;
		variant?: 'primary' | 'outlined' | 'secondary';
		class?: string;
		element?: HTMLTextAreaElement | undefined;
		value?: string | number | null | undefined;
	} & HTMLTextareaAttributes = $props();
</script>

<label class="flex flex-col gap-1">
	{#if label}
		<span
			class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
		>
			{label}
		</span>
	{/if}

	<textarea
		bind:this={element}
		bind:value
		data-ui="textarea"
		data-variant={variant}
		class={cn(classProp, input({ variant }), 'min-h-[7rem] resize-y py-[0.7rem] leading-6')}
		{...rest}
		{placeholder}
	></textarea>

	{#if description}
		<span class="text-sm text-foreground-muted">{description}</span>
	{/if}
</label>
