<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ModalFooterProps } from '.';

	let { class: className, children, ...rest }: ModalFooterProps = $props();
</script>

<div
	{...rest}
	class={cn(
		className,
		'flex w-full flex-col-reverse justify-end gap-2 border-border bg-transparent px-[var(--panel-padding-lg)] pb-[var(--panel-padding-lg)] sm:flex-row sm:items-center rounded-b-[var(--radius-lg)]'
	)}
>
	{@render children?.()}
</div>
