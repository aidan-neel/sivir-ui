<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionSubmitProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let {
        label = 'Submit answer',
        loadingLabel = 'Submitting...',
        children,
        disabled = false,
        class: className,
        element = $bindable(),
        onclick,
        'aria-disabled': ariaDisabled,
        ...rest
    }: QuestionSubmitProps = $props();

    const context = getQuestionContext();
    const submitting = $derived(context.status === 'submitting');
    const faceClass =
        'col-start-1 row-start-1 flex items-center justify-center gap-1.5 transition-[opacity,translate,filter] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none';
    const restingFaceClass = 'translate-y-0 opacity-100 blur-[0px]';
</script>

<Button
    bind:element
    {...rest}
    type="submit"
    variant="primary"
    size="md"
    data-ui="question-submit"
    disabled={context.disabled || disabled}
    class={className}
    aria-busy={submitting || undefined}
    aria-disabled={submitting || ariaDisabled}
    onclick={(event: MouseEvent) => {
        if (submitting) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onclick?.(event as Parameters<NonNullable<typeof onclick>>[0]);
    }}
>
    <span class="grid">
        <span
            aria-hidden={submitting || undefined}
            class={cn(faceClass, submitting ? '-translate-y-[3px] opacity-0 blur-[3px]' : restingFaceClass)}
        >
            {#if children}
                {@render children()}
            {:else}
                {label}
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            {/if}
        </span>
        <span
            aria-hidden={!submitting || undefined}
            class={cn(faceClass, submitting ? restingFaceClass : 'translate-y-[3px] opacity-0 blur-[3px]')}
        >
            <Spinner size={14} aria-hidden="true" />
            {loadingLabel}
        </span>
    </span>
</Button>
