<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();
</script>

<p {...props} data-ui="menu-label" class={cn(props.class, 'text-[length:var(--text-xs)] [font-weight:var(--font-weight-label,500)] text-[var(--menu-label-foreground)] select-none px-2 pb-0.5 pt-2')}>
	{@render props.children?.()}
</p>
