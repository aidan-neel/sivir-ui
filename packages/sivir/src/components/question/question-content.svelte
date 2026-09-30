<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { QuestionContentProps } from '.';
    import { getStepInDuration, type StepDirection, stepIn, stepOut } from './step-transition';

    let { step, class: className, children, ...rest }: QuestionContentProps = $props();

    let frame: HTMLDivElement | undefined;
    let previousStep = untrack(() => step);
    let direction: StepDirection = 1;
    let stepped = false;
    let startHeight: number | undefined;
    let resize: Animation | undefined;

    $effect.pre(() => {
        if (step === previousStep) {
            return;
        }

        const movingBack = step !== undefined && previousStep !== undefined && step < previousStep;

        direction = movingBack ? -1 : 1;
        previousStep = step;
        stepped = true;
        startHeight = frame?.getBoundingClientRect().height;
    });

    $effect(() => {
        return () => {
            resize?.cancel();
        };
    });

    function enter(node: Element) {
        if (!stepped) {
            return {
                duration: 0
            };
        }

        return stepIn(node, direction);
    }

    function leave(node: Element) {
        return stepOut(node, direction);
    }

    function settleHeight(node: HTMLElement) {
        const from = startHeight;
        startHeight = undefined;

        if (!frame || from === undefined) {
            return;
        }

        const to = node.offsetHeight;
        const duration = getStepInDuration(frame);

        resize?.cancel();
        if (Math.abs(from - to) < 1 || duration === 0) {
            return;
        }

        const easing = getComputedStyle(frame).getPropertyValue('--ease-out').trim();

        resize = frame.animate(
            [
                {
                    height: `${from}px`
                },
                {
                    height: `${to}px`
                }
            ],
            {
                duration,
                easing: easing || 'cubic-bezier(0.23, 1, 0.32, 1)'
            }
        );
    }
</script>

<div bind:this={frame} class="relative min-w-0 overflow-hidden">
    <div class="grid min-w-0 items-start">
        {#key step}
            <fieldset
                {...rest}
                use:settleHeight
                in:enter
                out:leave
                data-ui="question-content"
                tabindex={rest.tabindex ?? -1}
                class={cn(className, 'm-0 min-w-0 rounded-[var(--radius-md)] border-0 p-0 outline-none [grid-area:1/1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary')}
            >
                {@render children?.()}
            </fieldset>
        {/key}
    </div>
</div>
