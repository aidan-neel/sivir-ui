<!-- token-lint-disable-file -->
<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import { cn } from '@sivir/ui/utils';
	import { getContext, type Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	};

	const key = getContext('key') as string;
	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();
</script>

<Modal.Content
	{allowClickOutside}
	showClose={false}
	panelIdPrefix="command"
	data-ui="command-content"
	aria-labelledby={`command-${key}-trigger`}
	aria-describedby={undefined}
	class={cn(
		className,
		'fixed top-[47%] flex max-h-[min(var(--command-dialog-max-height),calc(100dvh-2rem))] min-h-[5rem] w-[calc(100%-2*var(--command-dialog-width-margin))] max-w-[var(--command-dialog-max-width)] flex-col overflow-hidden'
	)}
	surfaceClass="min-h-0 flex-1 gap-0 overflow-hidden p-0"
	{...rest}
>
	{@render children?.()}
</Modal.Content>
