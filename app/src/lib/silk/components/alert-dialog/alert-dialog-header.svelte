<script lang="ts">
	import { cn, type DefaultProps } from '$lib/silk/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	{...rest}
	class={cn(
		className,
		'flex flex-col gap-2 px-[var(--panel-padding-lg)] py-[var(--panel-padding-lg)]'
	)}
>
	{@render children?.()}
</div>
