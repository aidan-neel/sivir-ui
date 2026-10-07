<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { quartOut } from 'svelte/easing';
    import { prefersReducedMotion } from 'svelte/motion';

    let {
        count
    }: {
        count: number;
    } = $props();

    const DURATION = 220;
    const SHIFT = 6;

    let shown = $state(1);
    let direction = $state(1);

    $effect.pre(() => {
        const next = count;

        if (next <= 0) {
            return;
        }
        direction = next >= shown ? 1 : -1;
        shown = next;
    });

    const visible = $derived(count > 0);

    function roll(_node: HTMLElement, { entering }: { entering: boolean }) {
        const sign = entering ? direction : -direction;

        return {
            duration: prefersReducedMotion.current ? 0 : DURATION,
            easing: quartOut,
            css: (t: number, u: number) => {
                return `opacity: ${t}; filter: blur(${u * 2}px); transform: translateY(${sign * u * SHIFT}px);`;
            }
        };
    }
</script>

<span
    aria-hidden={visible ? undefined : 'true'}
    class={cn(
        '-ml-1.5 inline-grid transition-[grid-template-columns] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
        visible ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'
    )}
>
    <span class="min-w-0 overflow-hidden">
        <span class="flex pl-1.5">
            <span
                class={cn(
                    'grid h-4 min-w-4 place-items-center overflow-hidden rounded-full bg-foreground px-1 text-[0.6875rem] leading-none font-semibold text-background tabular-nums transition-[opacity,scale,filter] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                    visible ? 'scale-100 opacity-100 blur-none' : 'scale-50 opacity-0 blur-[2px]'
                )}
            >
                {#key shown}
                    <span
                        class="col-start-1 row-start-1"
                        in:roll={{
                            entering: true
                        }}
                        out:roll={{
                            entering: false
                        }}
                    >
                        {shown}
                    </span>
                {/key}
            </span>
        </span>
    </span>
</span>
