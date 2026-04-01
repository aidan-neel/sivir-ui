<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
    import { ChevronDown } from '@lucide/svelte';
    import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ButtonProps, ButtonVariant } from '$lib/silk/components/button';

    const key = getContext('key') as string;
    const uiState = states[key];

    type Props = {
        children: Snippet;
        class: string;
        variant?: ButtonVariant;
    } & ButtonProps

    let { children, class: className, variant, ...rest }: Props = $props();
</script>

<Popover.Trigger class={cn(className, ``)} {variant} {...rest}>
	{@render children?.()}
</Popover.Trigger>
