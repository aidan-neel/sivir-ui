<script lang="ts">
    import { setContext, untrack } from 'svelte';
    import type { TooltipProps } from '.';
    import type { TooltipRuntimeState } from './shared-tooltip';

    let { children, delay = 125, closeDelay = 100, placement = 'top' }: TooltipProps = $props();

    const tip = $state<TooltipRuntimeState>(
        untrack(() => ({
            text: '',
            shortcut: '',
            placement,
            delay,
            closeDelay,
            className: ''
        }))
    );

    $effect(() => {
        tip.placement = placement;
        tip.delay = delay;
        tip.closeDelay = closeDelay;
    });

    setContext('sivir-tooltip', tip);
</script>

{@render children?.()}
