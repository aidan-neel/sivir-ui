<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';
	import { input } from './variants';

	let {
		placeholder,
		label,
		type = 'text',
		variant = 'primary',
		children,
		class: classProp,
		element = $bindable<HTMLInputElement>(),
		value = $bindable<string | number | boolean | FileList | undefined>(),
		checked = $bindable<boolean | undefined>(),
		files = $bindable<FileList | undefined>(),
		selectedIndex = $bindable<number | undefined>(),
		...rest
	}: {
		placeholder?: string;
		children?: Snippet;
		label?: string;
		type?: string;
		variant?: 'primary' | 'outlined';
		class?: string;
		element?: HTMLInputElement | undefined;
		value?: string | number | boolean | FileList | undefined;
		checked?: boolean | undefined;
		files?: FileList | undefined;
		selectedIndex?: number | undefined;
	} & HTMLInputAttributes = $props();
</script>

<label class="flex flex-col gap-1">
	{#if label}
		<span class="text-text text-sm font-medium">{label}</span>
	{/if}

	{#if type === 'file'}
		<input
			bind:this={element}
			bind:value
			bind:files
			type="file"
			class={cn(classProp, input({ variant }))}
			{...rest}
			{placeholder}
		/>
	{:else if type === 'checkbox'}
		<input
			bind:this={element}
			bind:value
			bind:checked
			type="checkbox"
			class={cn(classProp, input({ variant }))}
			{...rest}
			{placeholder}
		/>
	{:else}
		<input
			bind:this={element}
			bind:value
			{type}
			class={cn(classProp, input({ variant }))}
			{...rest}
			{placeholder}
		/>
	{/if}
</label>
