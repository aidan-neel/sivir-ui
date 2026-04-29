<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ModalHeaderProps } from '.';

	let { class: className, children, ...rest }: ModalHeaderProps = $props();
</script>

<div
	{...rest}
	class={cn(className, 'flex flex-col gap-2 px-[var(--panel-padding-lg)] py-[var(--panel-padding-lg)]')}
>
	{@render children?.()}
</div>
