<script lang="ts">
	import { cn, type DefaultProps } from '@sivir/ui/utils';

	let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<div {...rest} class={cn(className, 'flex flex-col gap-[var(--modal-title-description-gap,6px)]')}>
	{@render children?.()}
</div>
