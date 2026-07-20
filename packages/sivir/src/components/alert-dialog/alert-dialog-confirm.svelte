<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';
	import { getModalContext } from '../modal/context.svelte';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();
	const modal = getModalContext();
</script>

<Button
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
