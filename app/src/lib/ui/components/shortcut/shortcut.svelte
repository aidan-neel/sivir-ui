<script lang="ts">
	import { states } from '$lib/ui/internals/state.svelte';
	import { cn } from '$lib/ui/utils';
	import { getContext, onMount, type Snippet } from 'svelte';
	import type { ButtonState } from '../button';

    const key = getContext('key') as string;
    const uiState = states[key].data as ButtonState;
    
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

<p {...rest} class={cn(className, "text-[11px] text-foreground-muted/80")}>
    {@render children?.()}
</p>