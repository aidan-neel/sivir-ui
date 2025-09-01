<script lang="ts">
	import { cn } from "$lib/ui/utils";
	import type { SheetTitleProps } from ".";

    let { class: className, children, ...rest }: SheetTitleProps = $props();
</script>

<h1 {...rest} class={cn(className, `text-lg font-medium tracking-tight`)}>
    {@render children?.()}
</h1>