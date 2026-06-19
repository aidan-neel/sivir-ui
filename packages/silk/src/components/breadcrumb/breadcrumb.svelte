<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { BreadcrumbProps } from '.';

	let { class: className, children, ...rest }: BreadcrumbProps = $props();
</script>

<nav
	aria-label="Breadcrumb"
	{...rest}
	class={cn(className, `flex flex-row gap-[var(--breadcrumb-gap)] items-center`)}
>
	{@render children?.()}
</nav>
