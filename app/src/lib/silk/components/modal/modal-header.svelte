<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ModalHeaderProps } from '.';

	let { class: className, children, ...rest }: ModalHeaderProps = $props();
</script>

<div
	{...rest}
	class={cn(className, 'flex flex-col gap-[var(--modal-title-description-gap,6px)]')}
>
	{@render children?.()}
</div>
