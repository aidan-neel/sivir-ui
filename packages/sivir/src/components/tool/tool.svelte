<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { ToolRootProps } from '.';
    import { setToolContext } from './context.svelte';

    let {
        state = 'running',
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        children,
        class: className,
        ...rest
    }: ToolRootProps = $props();

    const id = $props.id();
    let contentRegistered = false;
    let previousOpen = untrack(() => open);

    function settle(value: boolean) {
        if (value !== open) {
            return;
        }
        onOpenChangeComplete?.(value);
    }

    setToolContext({
        id,
        get open() {
            return open;
        },
        set open(value) {
            open = value;
        },
        get state() {
            return state;
        },
        registerContent() {
            if (contentRegistered) {
                throw new Error('Tool.Root supports exactly one Tool.Content.');
            }
            contentRegistered = true;

            return () => {
                contentRegistered = false;
            };
        },
        settle
    });

    $effect(() => {
        const next = open;

        if (next === previousOpen) {
            return;
        }
        previousOpen = next;

        untrack(() => {
            onOpenChange?.(next);
        });

        if (!contentRegistered) {
            queueMicrotask(() => {
                settle(next);
            });
        }
    });
</script>

<section
    {...rest}
    data-ui="tool"
    data-state={state}
    data-open={open}
    aria-busy={state === 'running'}
    class={cn(className, 'flex w-full max-w-full flex-col items-start text-sm text-foreground')}
>
    {@render children?.()}
</section>
