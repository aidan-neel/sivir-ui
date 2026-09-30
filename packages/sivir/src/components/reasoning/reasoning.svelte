<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { ReasoningRootProps } from '.';
    import { setReasoningContext } from './context.svelte';

    let {
        streaming = false,
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        children,
        class: className,
        ...rest
    }: ReasoningRootProps = $props();

    const id = $props.id();
    let contentRegistered = false;
    let previousOpen = untrack(() => open);

    function settle(value: boolean) {
        if (value !== open) {
            return;
        }
        onOpenChangeComplete?.(value);
    }

    setReasoningContext({
        id,
        get open() {
            return open;
        },
        set open(value) {
            open = value;
        },
        get streaming() {
            return streaming;
        },
        registerContent() {
            if (contentRegistered) {
                throw new Error('Reasoning.Root supports exactly one Reasoning.Content.');
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
    data-ui="reasoning"
    data-state={open ? 'open' : 'closed'}
    data-streaming={streaming}
    aria-busy={streaming}
    class={cn(className, 'flex w-full max-w-full flex-col items-start text-sm text-foreground')}
>
    {@render children?.()}
</section>
