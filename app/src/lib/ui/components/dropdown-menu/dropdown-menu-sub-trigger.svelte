<script lang="ts">
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn } from "$lib/ui/utils";
    import { getContext, setContext, type Snippet } from 'svelte';
    import { ChevronRight } from "@lucide/svelte";
    import * as Popover from "$lib/ui/components/popover";

    const key = Math.random().toString(36).substring(2);
    setContext('parent', getContext('key'));

    type SubTriggerProps = {
        class?: string;
        children?: Snippet;
    } & ButtonProps;
    
    let { class: className, children, ...rest }: SubTriggerProps = $props();
</script>

<Popover.Trigger
    {...rest}
    class={cn(className, "w-full h-9 duration-100 rounded-lg hover:cursor-default px-3 hover:bg-muted/50 items-center justify-between text-left")}
    variant="ghost"
>
    {@render children?.()}
    <ChevronRight class="text-foreground-muted" size={20} />
</Popover.Trigger>
