<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { ReasoningRootProps } from '.';
    import { setReasoningContext } from './context.svelte';

    let {
        streaming = false,
        open = $bindable(false),
        duration,
        onOpenChange,
        onOpenChangeComplete,
        children,
        class: className,
        ...rest
    }: ReasoningRootProps = $props();

    const id = $props.id();
    let contentRegistered = false;
    let previousStreaming = untrack(() => streaming);
    let elapsed = $state(0);
    const seconds = $derived(duration ?? elapsed);

    if (previousStreaming) {
        open = true;
    }

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
        get seconds() {
            return seconds;
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
        const next = streaming;

        if (next === previousStreaming) {
            return;
        }
        previousStreaming = next;

        if (next) {
            open = true;
        }
    });

    $effect(() => {
        if (!streaming) {
            return;
        }

        const startedAt = performance.now();
        elapsed = 0;

        const timer = setInterval(() => {
            elapsed = Math.floor((performance.now() - startedAt) / 1000);
        }, 250);

        return () => {
            elapsed = Math.floor((performance.now() - startedAt) / 1000);
            clearInterval(timer);
        };
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
