<script lang="ts">
	import { cn } from "$lib/silk/utils";
    import type { BreadcrumbItemProps } from ".";
    import { page } from "$app/state";

    let { href, class: className, children, ...rest }: BreadcrumbItemProps = $props();
</script>

<a {...rest} href={href} class={cn(className, `${page.url.pathname === href ? 'text-foreground [font-weight:var(--font-weight-body,400)]' : 'text-foreground-muted hover:text-foreground duration-200'} text-sm`)}>
    {@render children?.()}
</a>
