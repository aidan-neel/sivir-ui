<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { PopoverState } from '@sivir/ui/components/popover';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	const key = getContext('key') as string;
	const parent = getContext('parent') as string;
	const uiState = states[key] as UIState<PopoverState>;

	type Props = {
		class?: string;
		children?: Snippet;
		callback?: () => void;
	} & ButtonProps;

	let { children, class: className, callback, onclick: userOnclick, ...rest }: Props = $props();
</script>

<Button
	role="menuitem"
	{...rest}
	onclick={() => {
		uiState.data.open = false;
		setTimeout(() => {
			if (parent) {
				(states[parent].data as PopoverState).open = false;
			}
		}, 100);
		callback?.();
		userOnclick?.();
	}}
	class={cn(className, `${MENU_ITEM} flex-row gap-3 text-sm`)}
	variant="ghost"
>
	{@render children?.()}
</Button>
