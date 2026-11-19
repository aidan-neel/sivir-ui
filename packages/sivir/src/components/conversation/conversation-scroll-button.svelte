<script lang="ts">
    import ArrowDown from '@lucide/svelte/icons/arrow-down';
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { ConversationScrollButtonProps } from '.';
    import { getConversationContext } from './context.svelte';

    let {
        label = 'Scroll to latest message',
        class: className,
        onclick,
        ...rest
    }: ConversationScrollButtonProps = $props();

    const conversation = getConversationContext();
    const visible = $derived(!conversation.follow && !conversation.atBottom);

    function scrollToBottom() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        conversation.scrollToBottom(reducedMotion ? 'auto' : 'smooth');
    }
</script>

<div class="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-4">
    <button
        {...rest}
        type="button"
        use:pressable
        data-ui="conversation-scroll-button"
        data-state={visible ? 'visible' : 'hidden'}
        aria-label={label}
        aria-hidden={!visible}
        disabled={!visible}
        tabindex={visible ? undefined : -1}
        class={cn(
            className,
            'pointer-events-auto inline-flex size-9 items-center justify-center rounded-full bg-panel bg-[image:var(--fill-raised)] text-foreground shadow-[var(--shadow-raised)] transition-[background-color,box-shadow,color,opacity,translate] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:bg-[image:var(--fill-raised-hover)] hover:shadow-[var(--shadow-raised-hover)] active:bg-[image:var(--fill-raised-press)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring),var(--shadow-raised)] motion-reduce:translate-y-0 motion-reduce:transition-none',
            visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0'
        )}
        onclick={(event) => {
            scrollToBottom();
            onclick?.(event);
        }}
    >
        <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
    </button>
</div>
