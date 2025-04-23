<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div
	{...rest}
	class={cn(
		classProp,
		`w-full flex border-t items-center flex-row rounded-lg-b justify-end gap-2 p-3 bg-secondary`
	)}
>
	{@render children?.()}
</div>
