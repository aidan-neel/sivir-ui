<script lang="ts">
    import { cn } from "$lib/silk/utils";
    import { ChevronRight } from "@lucide/svelte";
    import * as Popover from "$lib/silk/components/popover";
	import type { ContextMenuSubTriggerProps } from ".";

    let { class: className, children, inset = false, ...rest }: ContextMenuSubTriggerProps = $props();
</script>

<Popover.Trigger
    {...rest}
    class={cn(className, `min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--menu-item-radius)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] hover:border-[var(--menu-item-hover-border)] hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[active=true]:border-[var(--menu-item-hover-border)] data-[active=true]:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[selected=true]:bg-[var(--menu-item-active-bg)] px-2 ${inset ? 'pl-8' : ''} flex w-full items-center justify-between text-left text-[14px] duration-50 hover:cursor-default`)}
    variant="ghost"
>
    <span class="min-w-0 flex-1 text-left">
        {@render children?.()}
    </span>
    <ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
