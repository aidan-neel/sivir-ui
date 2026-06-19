<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { BreadcrumbItemProps } from '.';
	import { page } from '$app/state';

	let { href, class: className, children, ...rest }: BreadcrumbItemProps = $props();

	const current = $derived(page.url.pathname === href);
</script>

<a
	{...rest}
	{href}
	aria-current={current ? 'page' : undefined}
	class={cn(
		className,
		`${current ? 'text-foreground [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]' : 'text-foreground-muted hover:text-foreground duration-200'} [font-size:var(--font-size-body,16px)]`
	)}
>
	{@render children?.()}
</a>
