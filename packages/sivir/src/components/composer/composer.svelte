<script lang="ts">
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerProps, ComposerStatus } from '.';
    import { setComposerContext } from './context.svelte';

    let {
        value = $bindable(''),
        status = 'idle',
        generating,
        disabled = false,
        allowEmpty = false,
        onSubmit,
        onStop,
        class: className,
        children,
        ...rest
    }: ComposerProps = $props();

    let form: HTMLFormElement | undefined;
    let pending = $state(false);
    const effectiveStatus = $derived<ComposerStatus>(
        status === 'submitting' || pending ? 'submitting' : status
    );
    const errorNoticeClass = 'sivir-error-notice';

    const context = setComposerContext({
        get value() {
            return value;
        },
        set value(next: string) {
            value = next;
        },
        get status() {
            return effectiveStatus;
        },
        get disabled() {
            return disabled;
        },
        get allowEmpty() {
            return allowEmpty;
        },
        get generating() {
            return generating;
        },
        get pending() {
            return pending || (generating !== undefined && status === 'submitting');
        },
        submit() {
            if (!disabled && !pending) {
                form?.requestSubmit();
            }
        },
        stop() {
            if (
                !disabled &&
                (generating || (generating === undefined && status === 'submitting'))
            ) {
                onStop?.();
            }
        }
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (
            context.disabled ||
            context.pending ||
            (!context.allowEmpty && context.value.trim() === '')
        ) {
            return;
        }

        pending = true;
        try {
            await onSubmit?.(context.value, event);
        } finally {
            pending = false;
        }
    }
</script>

<div
    data-ui="composer"
    data-state={effectiveStatus}
    data-disabled={disabled || undefined}
    data-generating={generating || undefined}
    aria-busy={pending}
    class="w-full"
>
    <div
        data-state={effectiveStatus}
        class="max-h-0 overflow-hidden transition-[max-height] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:max-h-24"
    >
        <div
            data-ui="composer-error"
            role={effectiveStatus === 'error' ? 'alert' : undefined}
            aria-hidden={effectiveStatus !== 'error'}
            class={cn(errorNoticeClass, 'ml-4')}
            data-state={effectiveStatus}
        >
            <CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
            <span>Message could not be sent.</span>
        </div>
    </div>

    <form
        bind:this={form}
        {...rest}
        data-ui="composer-form"
        data-state={effectiveStatus}
        data-disabled={disabled || undefined}
        data-generating={generating || undefined}
        aria-busy={pending}
        onsubmit={handleSubmit}
        class={cn(
            className,
            'flex w-full flex-col rounded-[calc(var(--radius-xl)+var(--spacing)*2)] border-[length:var(--border-size)] border-border bg-card text-foreground shadow-[var(--elevation-1)] transition-[border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none focus-within:border-border-strong focus-within:shadow-[var(--elevation-float)] has-[>[data-ui=attachment-list]:not([hidden])]:flex-row has-[>[data-ui=attachment-list]:not([hidden])]:flex-wrap data-[state=error]:border-[color-mix(in_srgb,var(--color-error)_70%,transparent)] data-[state=error]:shadow-[0_0_0_calc(var(--border-size)*2)_color-mix(in_srgb,var(--color-error)_25%,transparent),var(--elevation-1)]'
        )}
    >
        {@render children?.()}
    </form>
</div>
