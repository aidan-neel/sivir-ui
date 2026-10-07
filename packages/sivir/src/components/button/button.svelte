<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
    import type { ButtonProps, ButtonStatus } from '.';
    import { button } from './variants';

    let {
        href,
        variant = 'primary',
        children,
        class: classProp,
        size = 'md',
        element = $bindable(),
        unstyled = false,
        status,
        loading,
        loadingLabel,
        successLabel,
        errorLabel,
        'aria-label': ariaLabel,
        'aria-disabled': ariaDisabled,
        onclick,
        ...rest
    }: ButtonProps = $props();

    const visualStatus = $derived(status ?? (loading ? 'loading' : 'idle'));
    const statusClasses = $derived(
        unstyled
            ? undefined
            : visualStatus === 'success'
              ? 'bg-[color-mix(in_srgb,var(--color-success)_85%,black)] text-white shadow-[inset_0_0_0_var(--border-size)_color-mix(in_srgb,var(--color-success)_65%,black)] hover:bg-[color-mix(in_srgb,var(--color-success)_78%,black)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-success)_78%,black)] dark:bg-[color-mix(in_srgb,var(--color-success)_75%,black)] dark:shadow-[inset_0_0_0_var(--border-size)_color-mix(in_srgb,var(--color-success)_55%,black)] dark:hover:bg-[color-mix(in_srgb,var(--color-success)_68%,black)] dark:data-[state=open]:bg-[color-mix(in_srgb,var(--color-success)_68%,black)]'
              : visualStatus === 'error'
                ? 'bg-[color-mix(in_srgb,var(--color-error)_80%,black)] text-white shadow-[inset_0_0_0_var(--border-size)_color-mix(in_srgb,var(--color-error)_60%,black)] hover:bg-[color-mix(in_srgb,var(--color-error)_72%,black)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_72%,black)]'
                : undefined
    );
    const stateful = $derived(
        status !== undefined ||
            loading !== undefined ||
            loadingLabel !== undefined ||
            successLabel !== undefined ||
            errorLabel !== undefined
    );
    const statusMotionClasses = $derived(
        stateful && !unstyled
            ? '[transition-duration:var(--motion-duration-swap),var(--motion-duration-swap),var(--motion-duration-swap),var(--motion-duration-press),var(--motion-duration-press),var(--motion-duration-press)]'
            : undefined
    );
    const styledClasses = $derived(
        cn(
            classProp,
            statusClasses,
            statusMotionClasses,
            unstyled ? undefined : button({ variant, size })
        )
    );
    const pending = $derived(visualStatus === 'loading');
    const currentLabel = $derived(
        visualStatus === 'loading'
            ? (loadingLabel ?? 'Loading…')
            : visualStatus === 'success'
              ? (successLabel ?? 'Done')
              : visualStatus === 'error'
                ? (errorLabel ?? 'Try again')
                : ariaLabel
    );

    const faceClass =
        'flex items-center justify-center transition-[opacity,translate,filter] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)] motion-reduce:transition-none';
    const activeFaceClass = 'relative translate-y-0 opacity-100 blur-[0]';
    const leavingFaceClass =
        'pointer-events-none absolute inset-0 -translate-y-[var(--motion-swap-y)] opacity-0 blur-[var(--motion-swap-blur)] [transition-duration:calc(var(--motion-duration-swap)*0.5)]';
    const waitingFaceClass =
        'pointer-events-none absolute inset-0 translate-y-[var(--motion-swap-y)] opacity-0 blur-[var(--motion-swap-blur)]';
    const faceContentClass = 'inline-flex w-max items-center gap-1.5';
    const letterClass =
        'inline-block whitespace-pre transition-[opacity,translate,filter] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)] motion-reduce:transition-none';
    const shownLetterClass = 'translate-y-0 opacity-100 blur-[0]';
    const hiddenLetterClass =
        'translate-y-[var(--motion-swap-y)] opacity-0 blur-[var(--motion-swap-blur)]';

    let idleRect = $state<DOMRectReadOnly>();
    let loadingRect = $state<DOMRectReadOnly>();
    let successRect = $state<DOMRectReadOnly>();
    let errorRect = $state<DOMRectReadOnly>();

    const faceRects = $derived({
        idle: idleRect,
        loading: loadingRect,
        success: successRect,
        error: errorRect
    });
    const activeWidth = $derived(faceRects[visualStatus]?.width);

    let leavingStatus = $state<ButtonStatus>();
    let shownStatus: ButtonStatus | undefined;

    $effect.pre(() => {
        const nextStatus = visualStatus;

        if (shownStatus !== undefined && shownStatus !== nextStatus) {
            leavingStatus = shownStatus;
        }
        shownStatus = nextStatus;
    });

    function faceClasses(face: ButtonStatus) {
        if (face === visualStatus) {
            return cn(activeFaceClass, faceClass);
        }
        if (face === leavingStatus) {
            return cn(leavingFaceClass, faceClass);
        }

        return cn(waitingFaceClass, faceClass);
    }

    function letterDelay(index: number, count: number) {
        const progress = index / Math.max(count - 1, 1);

        return `calc(var(--motion-duration-swap) * ${progress * 0.6})`;
    }

    function activate(event: MouseEvent) {
        if (pending) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onclick?.(event);
    }
</script>

{#snippet letters(text: string, shown: boolean)}
    {@const characters = Array.from(text)}
    <span class="inline-flex">
        {#each characters as character, index (index)}
            <span
                class={cn(letterClass, shown ? shownLetterClass : hiddenLetterClass)}
                style:transition-delay={shown ? letterDelay(index, characters.length) : undefined}
                >{character}</span
            >
        {/each}
    </span>
{/snippet}

{#snippet content()}
    {#if stateful}
        <span
            class="relative inline-flex shrink-0 justify-center overflow-x-clip transition-[width] [transition-duration:calc(var(--motion-duration-swap)*2)] ease-[var(--ease-out)] motion-reduce:transition-none"
            style:width={activeWidth === undefined ? undefined : `${activeWidth}px`}
        >
            <span class={faceClasses('idle')} aria-hidden={visualStatus !== 'idle'}>
                <span bind:contentRect={idleRect} class={faceContentClass}>
                    {@render children?.()}
                </span>
            </span>
            <span
                class={cn(faceClasses('loading'), 'text-current/75')}
                aria-hidden={visualStatus !== 'loading'}
            >
                <span bind:contentRect={loadingRect} class={faceContentClass}>
                    <svg
                        class={cn(
                            'size-3 animate-[spin_600ms_linear_infinite] motion-reduce:animate-none',
                            !pending && '[animation-play-state:paused]'
                        )}
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            cx="6"
                            cy="6"
                            r="4.5"
                            stroke="currentColor"
                            stroke-width="1.5"
                            opacity="0.22"
                        />
                        <path
                            d="M10.5 6A4.5 4.5 0 0 0 6 1.5"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        />
                    </svg>
                    {@render letters(loadingLabel ?? 'Loading…', visualStatus === 'loading')}
                </span>
            </span>
            <span class={faceClasses('success')} aria-hidden={visualStatus !== 'success'}>
                <span bind:contentRect={successRect} class={faceContentClass}>
                    <svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                            d="M2.6 6.3 4.9 8.6 9.4 3.6"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    {@render letters(successLabel ?? 'Done', visualStatus === 'success')}
                </span>
            </span>
            <span class={faceClasses('error')} aria-hidden={visualStatus !== 'error'}>
                <span bind:contentRect={errorRect} class={faceContentClass}>
                    <svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                            d="M6 2.9v3.5M6 9.05h.01"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                        />
                    </svg>
                    {@render letters(errorLabel ?? 'Try again', visualStatus === 'error')}
                </span>
            </span>
        </span>
    {:else}
        {@render children?.()}
    {/if}
{/snippet}

{#if href}
    <a
        bind:this={element as HTMLAnchorElement}
        use:pressable
        href={pending ? undefined : href}
        role={pending ? 'link' : undefined}
        tabindex={pending ? 0 : (rest as HTMLAnchorAttributes).tabindex}
        data-ui="button"
        data-variant={unstyled ? undefined : variant}
        data-size={size}
        class={styledClasses}
        aria-label={currentLabel}
        aria-busy={pending || undefined}
        aria-disabled={pending || ariaDisabled}
        onclick={activate}
        onkeydown={(e) => {
            if (
                (e.code === 'Space' || e.key === ' ') &&
                e.currentTarget.matches(':focus-visible')
            ) {
                e.preventDefault();
                e.currentTarget.click();
            }
        }}
        {...rest as HTMLAnchorAttributes}
    >
        {@render content()}
    </a>
{:else}
    <button
        bind:this={element as HTMLButtonElement}
        use:pressable
        type={(rest as HTMLButtonAttributes).type ?? 'button'}
        data-ui="button"
        data-variant={unstyled ? undefined : variant}
        data-size={size}
        class={styledClasses}
        aria-label={currentLabel}
        aria-busy={pending || undefined}
        aria-disabled={pending || ariaDisabled}
        onclick={activate}
        {...rest as HTMLButtonAttributes}
    >
        {@render content()}
    </button>
{/if}

{#if stateful}
    <span role="status" aria-live="polite" class="sr-only">
        {visualStatus === 'success'
            ? (successLabel ?? 'Done')
            : visualStatus === 'error'
              ? (errorLabel ?? 'Try again')
              : ''}
    </span>
{/if}
