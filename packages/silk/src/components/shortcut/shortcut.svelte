<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import { getContext, onMount, type Snippet } from 'svelte';

    // Mirrors button.svelte's internal state shape -- kept as a local type
    // since the public `ButtonState` export was removed in button@2.0.0.
    type ButtonStateShape = { onclick?: (() => void) | undefined };

    const key = getContext('key') as string | undefined;
    // Shortcut is most commonly used inside a Button (auto-wires onclick), but
    // it can also be rendered standalone. When there's no parent Button,
    // `uiState` is undefined and the key handler simply does nothing.
    const uiState = key ? (states[key]?.data as ButtonStateShape | undefined) : undefined;

    type Props = {
        children?: Snippet;
        class?: string;
        shortcut: string;
    }

    let { children, class: className, shortcut, ...rest}: Props = $props();

    function handleKey(event: KeyboardEvent) {
        if (uiState) {
            const keys = shortcut.split('+').map(k => k.trim().toLowerCase());

            const meta = keys.includes('cmd') || keys.includes('command');
            const shift = keys.includes('shift');
            const ctrl = keys.includes('ctrl') || keys.includes('control');
            const alt = keys.includes('alt');
            const keyChar = keys.find(k => !['cmd','command','ctrl','control','shift','alt'].includes(k));

            if (
                event.key.toLowerCase() === keyChar &&
                event.metaKey === meta &&
                event.shiftKey === shift &&
                event.ctrlKey === ctrl &&
                event.altKey === alt
            ) {
                event.preventDefault();
                uiState.onclick?.();
            }
        }
    }


    onMount(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });
</script>

<p {...rest} class={cn(className, 'text-[11px] text-foreground-muted/80')}>
	{@render children?.()}
</p>
