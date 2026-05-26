<script lang="ts">
	import { cn, type DefaultProps } from '$lib/silk/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	{...rest}
	class={cn(
		className,
		'flex flex-col gap-[var(--modal-title-description-gap,6px)]'
	)}
>
	{@render children?.()}
</div>
