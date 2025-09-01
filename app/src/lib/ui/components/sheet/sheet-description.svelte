<script lang="ts">
	import { cn } from "$lib/ui/utils";
	import type { SheetTitleProps } from ".";

    let { class: className, children, ...rest }: SheetTitleProps = $props();
</script>

<h2 {...rest} class={cn(className, `text-sm text-foreground-muted`)}>
    {@render children?.()}
</h2>