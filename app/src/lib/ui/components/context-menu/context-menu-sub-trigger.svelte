<script lang="ts">
    import { cn } from "$lib/ui/utils";
    import { ChevronRight } from "@lucide/svelte";
    import * as Popover from "$lib/ui/components/popover";
	import type { ContextMenuSubTriggerProps } from ".";
    
    let { class: className, children, inset = false, ...rest }: ContextMenuSubTriggerProps = $props();
</script>

<Popover.Trigger
    {...rest}
    class={cn(className, `px-2 ${inset ? 'pl-8' : ''} w-full h-9 duration-100 rounded-lg font-normal hover:cursor-default hover:bg-muted/50 items-center justify-between text-left`)}
    variant="ghost"
>
    {@render children?.()}
    <ChevronRight class="text-foreground-muted" size={20} />
</Popover.Trigger>
