<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { BreadcrumbProps } from '.';

	let { class: className, children, ...rest }: BreadcrumbProps = $props();
</script>

<div {...rest} class={cn(className, `flex flex-row gap-[var(--breadcrumb-gap)] items-center`)}>
	{@render children?.()}
</div>
