<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { ToolRootProps } from '.';
    import { setToolContext } from './context.svelte';

    let {
        running = false,
        open = $bindable(false),
        duration,
        onOpenChange,
        onOpenChangeComplete,
        children,
        class: className,
        ...rest
    }: ToolRootProps = $props();

    const id = $props.id();
    let contentRegistered = false;
    let previousRunning = untrack(() => running);
    let elapsed = $state(0);
    const seconds = $derived(duration ?? elapsed);

    if (previousRunning) {
        open = true;
    }

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
        get running() {
            return running;
        },
        get seconds() {
            return seconds;
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
        const next = running;

        if (next === previousRunning) {
            return;
        }
        previousRunning = next;

        if (next) {
            open = true;
        }
    });

    $effect(() => {
        if (!running) {
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
    data-ui="tool"
    data-state={open ? 'open' : 'closed'}
    data-running={running}
    aria-busy={running}
    class={cn(className, 'flex w-full max-w-full flex-col items-start text-sm text-foreground')}
>
    {@render children?.()}
</section>
