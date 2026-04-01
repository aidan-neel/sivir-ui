<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	type Placement = 'top' | 'left' | 'bottom' | 'right';

	type TooltipContext = {
		id: string;
		open: boolean;
		delay: number;
		closeDelay: number;
		placement: Placement;
		triggerEl?: HTMLElement;
		contentEl?: HTMLElement;
		openTimeout?: ReturnType<typeof setTimeout>;
		closeTimeout?: ReturnType<typeof setTimeout>;
	};

	const {
		children,
		delay = 120,
		closeDelay = 70,
		placement = 'top'
	}: {
		children?: Snippet;
		delay?: number;
		closeDelay?: number;
		placement?: Placement;
	} = $props();

	const tooltipState = $state({
		id: `tooltip-${Math.random().toString(36).slice(2)}`,
		open: false,
		delay: 120,
		closeDelay: 70,
		placement: 'top' as Placement
	});

	setContext('tooltip', tooltipState);

	$effect(() => {
		tooltipState.delay = delay;
		tooltipState.closeDelay = closeDelay;
		tooltipState.placement = placement;
	});
</script>

{@render children?.()}
