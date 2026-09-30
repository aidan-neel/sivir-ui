<script lang="ts">
    import ArrowUp from '@lucide/svelte/icons/arrow-up';
    import ListPlus from '@lucide/svelte/icons/list-plus';
    import Square from '@lucide/svelte/icons/square';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerSubmitProps } from '.';
    import { getComposerContext } from './context.svelte';

    let {
        label = 'Send',
        queueLabel = 'Queue message',
        stopLabel = 'Stop response',
        loadingLabel = 'Sending',
        children,
        element = $bindable(),
        disabled = false,
        class: className,
        onclick,
        ...rest
    }: ComposerSubmitProps = $props();

    const context = getComposerContext();
    const empty = $derived(context.value.trim() === '');
    const action = $derived.by(() => {
        if (context.pending) {
            return 'pending';
        }
        if (context.generating === undefined && context.status === 'submitting') {
            return 'stop';
        }
        if (context.generating) {
            return empty ? 'stop' : 'queue';
        }
        return 'send';
    });
    const isPending = $derived(action === 'pending');
    const iconOnly = $derived(!children);
    const neutral = $derived(action === 'stop');
    const busy = $derived(action === 'stop' || action === 'queue' || (isPending && iconOnly));
    const isDisabled = $derived(
        context.disabled || disabled || (action === 'send' && !context.allowEmpty && empty)
    );
    const actionLabel = $derived(
        action === 'stop'
            ? stopLabel
            : action === 'queue'
              ? queueLabel
              : isPending
                ? loadingLabel
                : label
    );

    function handleClick(event: MouseEvent) {
        onclick?.(event);
        if (!event.defaultPrevented && action === 'stop') {
            context.stop();
        }
    }
</script>

<Button
    bind:element
    size={iconOnly ? 'icon' : 'md'}
    {...rest}
    type={action === 'stop' || isPending ? 'button' : 'submit'}
    variant={neutral ? 'secondary' : 'primary'}
    data-ui="composer-submit"
    data-state={action}
    data-busy={busy || undefined}
    disabled={isDisabled}
    loading={iconOnly ? undefined : isPending}
    loadingLabel={iconOnly ? undefined : loadingLabel}
    aria-label={actionLabel}
    aria-busy={isPending}
    aria-disabled={isPending && iconOnly ? true : undefined}
    onclick={handleClick}
    class={cn(
        className,
        'relative shrink-0 rounded-full after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border-2 after:opacity-0 after:transition-opacity after:[transition-duration:var(--motion-duration-panel)] after:ease-[var(--ease-out)] data-[busy]:after:opacity-100 motion-safe:data-[busy]:after:animate-spin motion-reduce:after:transition-none',
        neutral
            ? 'after:border-foreground/15 after:border-t-foreground'
            : 'after:border-[color-mix(in_srgb,var(--color-on-primary)_30%,transparent)] after:border-t-[var(--color-on-primary)]'
    )}
>
    {#if children}
        {@render children({ action, generating: context.generating ?? false, empty })}
    {:else if action === 'stop'}
        <Square size={10} fill="currentColor" aria-hidden="true" />
    {:else if action === 'queue'}
        <ListPlus size={16} strokeWidth={2.25} aria-hidden="true" />
    {:else}
        <ArrowUp
            size={16}
            strokeWidth={2.25}
            aria-hidden="true"
            class={cn(
                'transition-opacity [transition-duration:var(--motion-duration-press)] motion-reduce:transition-none',
                isPending && 'opacity-60'
            )}
        />
    {/if}
</Button>
