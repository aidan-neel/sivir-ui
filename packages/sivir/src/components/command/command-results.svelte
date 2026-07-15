<!-- token-lint-disable-file -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCommandContext } from './context.svelte';

	const command = getCommandContext();

	type Props = {
		children?: Snippet;
	};

	const { children }: Props = $props();
</script>

<div
	id={`${command.id}-listbox`}
	role="listbox"
	aria-label="Command results"
	class="max-h-full overflow-y-auto p-[var(--menu-padding)] pb-[calc(var(--menu-padding)+0.375rem)]"
>
	{#if command.searchContent === '' || command.results.length > 0}
		{@render children?.()}
	{:else}
		<div class="flex w-full items-center justify-center p-[var(--panel-padding)]">
			<p class="text-sm text-foreground-muted">No results found</p>
		</div>
	{/if}
</div>
