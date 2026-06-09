<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '@silk/ui/utils';
	import { input } from '@silk/ui/components/input/variants';

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
			class="[font-size:calc(var(--font-size-body,16px)*0.875)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground [font-family:var(--font-sans),sans-serif]"
		>
			{label}
		</span>
	{/if}

	<textarea
		bind:this={element}
		bind:value
		data-ui="textarea"
		data-variant={variant}
		class={cn(
			classProp,
			'min-h-[var(--textarea-min-height)] resize-y py-[var(--textarea-padding-y)] leading-6',
			input({ variant })
		)}
		{...rest}
		{placeholder}
	></textarea>

	{#if description}
		<span
			class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
			>{description}</span
		>
	{/if}
</label>
