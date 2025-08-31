<script lang="ts">
	import { cn } from "$lib/ui/utils";
    import type {  BreadcrumbSeparatorProps } from ".";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";

    let { class: className, children, ...rest }: BreadcrumbSeparatorProps = $props();
</script>

{#if children}
    {@render children?.()}
{:else}
    <ChevronRight {...rest} size={14} class={cn(className, `text-foreground-muted`)} />
{/if}