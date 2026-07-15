<!-- token-lint-disable-file -->
<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
		label?: string;
	};

	const {
		children,
		class: className,
		allowClickOutside = true,
		label = 'Command palette',
		...rest
	}: Props = $props();
</script>

<Modal.Content
	{allowClickOutside}
	showClose={false}
	panelIdPrefix="command"
	data-ui="command-content"
	aria-label={label}
	aria-labelledby={undefined}
	aria-describedby={undefined}
	class={cn(
		className,
		'fixed top-[47%] flex max-h-[min(28rem,calc(100dvh-2rem))] min-h-20 w-[calc(100%-3rem)] max-w-xl flex-col overflow-hidden' // token-lint-disable-line no-literal-length
	)}
	surfaceClass="min-h-0 flex-1 gap-0 overflow-hidden p-0"
	{...rest}
>
	{@render children?.()}
</Modal.Content>
