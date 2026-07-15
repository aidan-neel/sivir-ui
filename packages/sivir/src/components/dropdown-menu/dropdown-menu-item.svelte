<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { type Snippet } from 'svelte';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getPopoverContext } from '@sivir/ui/components/popover/context.svelte';
	import { getDropdownMenuContext } from './context.svelte';

	const { state: popoverState } = getPopoverContext();
	const { parentState } = getDropdownMenuContext();

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
		popoverState.open = false;
		if (parentState) parentState.open = false;
		callback?.();
		userOnclick?.();
	}}
	class={cn(className, `${MENU_ITEM} flex-row gap-3 text-sm`)}
	variant="ghost"
>
	{@render children?.()}
</Button>
