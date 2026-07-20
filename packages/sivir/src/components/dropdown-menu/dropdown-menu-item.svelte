<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { type Snippet } from 'svelte';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getPopoverContext } from '../popover/context.svelte';
	import { dismissDropdownMenu, getDropdownMenuContext } from './context.svelte';

	const { state: popoverState } = getPopoverContext();
	const { ancestors } = getDropdownMenuContext();

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
		dismissDropdownMenu(popoverState, ancestors);
		callback?.();
		userOnclick?.();
	}}
	class={cn(className, `${MENU_ITEM} flex-row gap-3 text-sm`)}
	variant="ghost"
>
	{@render children?.()}
</Button>
