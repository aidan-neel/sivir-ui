<script lang="ts">
	import { cn } from "$lib/silk/utils";
    import type { BreadcrumbProps } from ".";

    let { class: className, children, ...rest }: BreadcrumbProps = $props();
</script>

<div {...rest} class={cn(className, `flex flex-row gap-2 items-center`)}>
    {@render children?.()}
</div>
