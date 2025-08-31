<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { ComboboxState } from '.';
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
    import CaretSort from "@lucide/svelte/icons/chevrons-up-down"

	const key = getContext("key") as string;
	const uiState = states[key].data as ComboboxState;

	const { children, class: classProp, icon = true, ...rest }: Popover.PopoverTriggerProps = $props();
</script>

<Popover.Trigger
	{...rest}
	class={cn(classProp, `flex flex-row justify-between items-center px-3`)}
>
    {#if uiState.selected?.label}
        {uiState.selected?.label}
    {:else}
        {@render children?.()}
    {/if}
    {#if icon}
        <CaretSort class="text-foreground-muted size-3" />
    {/if}
</Popover.Trigger>
