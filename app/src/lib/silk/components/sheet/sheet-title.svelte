<script lang="ts">
	import { cn } from "$lib/silk/utils";
	import type { SheetTitleProps } from ".";

    let { class: className, children, ...rest }: SheetTitleProps = $props();
</script>

<h1
	{...rest}
	class={cn(className, `text-lg font-medium tracking-[-0.02em] [font-family:var(--font-header),sans-serif]`)}
>
    {@render children?.()}
</h1>
