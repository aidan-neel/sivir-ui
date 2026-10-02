<script lang="ts">
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
        'col-start-1 row-start-1 flex items-center justify-center gap-1.5 transition-[opacity,translate,filter] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)] motion-reduce:transition-none';
    const restingFaceClass = 'translate-y-0 opacity-100 blur-[0]';
    const exitUpClass =
        '-translate-y-[var(--motion-swap-y)] opacity-0 blur-[var(--motion-swap-blur)]';
    const enterDownClass =
        'translate-y-[var(--motion-swap-y)] opacity-0 blur-[var(--motion-swap-blur)]';
</script>

<Button
    bind:element
    {...rest}
    type="submit"
    variant="primary"
    size="sm"
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
    <span class="relative grid">
        <span
            aria-hidden={submitting || undefined}
            class={cn(faceClass, submitting ? exitUpClass : restingFaceClass)}
        >
            {#if children}
                {@render children()}
            {:else}
                {label}
            {/if}
        </span>
        <span
            aria-hidden={!submitting || undefined}
            class={cn(
                faceClass,
                'absolute inset-0',
                submitting ? restingFaceClass : enterDownClass
            )}
        >
            <Spinner size={14} aria-hidden="true" />
            <span class="sr-only">{loadingLabel}</span>
        </span>
    </span>
</Button>
