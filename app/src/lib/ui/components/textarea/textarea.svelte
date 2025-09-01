<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';

	let {
		placeholder,
		label,
		type = 'text',
		class: classProp,
		element = $bindable<HTMLTextAreaElement>(),
		value = $bindable<string | number | boolean | FileList | undefined>(),
		checked = $bindable<boolean | undefined>(),
		files = $bindable<FileList | undefined>(),
		selectedIndex = $bindable<number | undefined>(),
		...rest
	}: {
		placeholder?: string;
		label?: string;
		type?: string;
		class?: string;
		element?: HTMLTextAreaElement | undefined;
		value?: string | number | boolean | FileList | undefined;
		checked?: boolean | undefined;
		files?: FileList | undefined;
		selectedIndex?: number | undefined;
	} & HTMLInputAttributes = $props();
</script>

<label class="flex flex-col gap-1">
	{#if label}
		<span class="text-foreground text-sm font-medium font-sans">{label}</span>
	{/if}

    <textarea
        bind:this={element}
        bind:value
        class={cn(classProp, "p-3 focus-visible focus:outline-none dark:bg-secondary bg-accent text-foreground border-input/80 border rounded-lg")}
        {placeholder}
    ></textarea>
</label>
