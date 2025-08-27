<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';
    import { ChevronDown } from '@lucide/svelte';
    import { states } from '$lib/ui/internals/state.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ButtonVariant } from '$lib/ui/components/button';

    const key = getContext('key') as string;
    const uiState = states[key];

    type Props = {
        children: Snippet;
        class: string;
        variant?: ButtonVariant;
    } & HTMLAttributes<HTMLElement>

    let { children, class: className, variant, ...rest }: Props = $props();
</script>

<Popover.Trigger class={cn(className, ``)} variant={variant} {...rest}>
    {@render children?.()}
</Popover.Trigger>