<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';
	import { getCommandContext } from './context.svelte';

	const command = getCommandContext();

	type Props = {
		children: Snippet;
		class?: string;
		heading: string;
	};

	let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div
	{...rest}
	role="group"
	aria-label={heading}
	class="flex flex-col px-[var(--menu-padding)] pt-[var(--menu-padding)]"
>
	{#if command.searchContent === ''}
		<p
			class={cn(
				className,
				'text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--menu-label-foreground)] select-none px-[var(--menu-label-padding-x)] py-[var(--menu-label-padding-y)]'
			)}
		>
			{heading}
		</p>
	{/if}

	{@render children?.()}
</div>
