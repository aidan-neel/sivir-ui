<script lang="ts">
	import { cn } from "$lib/silk/utils";
	import type { SheetTitleProps } from ".";

    let { class: className, children, ...rest }: SheetTitleProps = $props();
</script>

<h2 {...rest} class={cn(className, `text-sm text-foreground-muted`)}>
    {@render children?.()}
</h2>
