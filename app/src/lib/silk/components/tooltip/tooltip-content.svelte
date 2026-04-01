<script lang="ts">
	import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { cn } from '$lib/silk/utils';
	import { getContext, onDestroy, tick, type Snippet } from 'svelte';
	import { flyAndScale } from '$lib/silk/internals/transition';

	type TooltipContext = {
		id: string;
		open: boolean;
		delay: number;
		closeDelay: number;
		placement: 'top' | 'left' | 'bottom' | 'right';
		triggerEl?: HTMLElement;
		contentEl?: HTMLElement;
		openTimeout?: ReturnType<typeof setTimeout>;
		closeTimeout?: ReturnType<typeof setTimeout>;
	};

	const tooltipState = getContext<TooltipContext>('tooltip');

	const { children, class: className }: { children?: Snippet; class?: string } = $props();

	let element: HTMLElement | undefined = $state();
	let stopAutoUpdate: (() => void) | undefined;

	async function updatePosition() {
		if (!tooltipState.triggerEl || !element || !tooltipState.open) return;

		const { x, y } = await computePosition(tooltipState.triggerEl, element, {
			placement: tooltipState.placement,
			strategy: 'fixed',
			middleware: [offset(8), flip(), shift({ padding: 10 })]
		});

		Object.assign(element.style, {
			position: 'fixed',
			left: `${x}px`,
			top: `${y}px`
		});
	}

	function cancelClose() {
		if (tooltipState.closeTimeout) clearTimeout(tooltipState.closeTimeout);
		tooltipState.closeTimeout = undefined;
	}

	function scheduleClose() {
		if (tooltipState.openTimeout) clearTimeout(tooltipState.openTimeout);
		if (tooltipState.closeTimeout) clearTimeout(tooltipState.closeTimeout);
		tooltipState.closeTimeout = setTimeout(() => {
			tooltipState.open = false;
		}, tooltipState.closeDelay);
	}

	$effect(() => {
		tooltipState.contentEl = element;
	});

	$effect(() => {
		if (!element) return;
		document.body.appendChild(element);

		return () => {
			stopAutoUpdate?.();
			stopAutoUpdate = undefined;
			element?.remove();
		};
	});

	$effect(() => {
		if (!tooltipState.open || !tooltipState.triggerEl || !element) {
			stopAutoUpdate?.();
			stopAutoUpdate = undefined;
			return;
		}

		stopAutoUpdate?.();
		stopAutoUpdate = autoUpdate(tooltipState.triggerEl, element, updatePosition);
		void tick().then(updatePosition);

		return () => {
			stopAutoUpdate?.();
			stopAutoUpdate = undefined;
		};
	});

	onDestroy(() => {
		stopAutoUpdate?.();
	});
</script>

<div
	bind:this={element as HTMLElement}
	class="pointer-events-none fixed left-0 top-0 z-[150]"
	onmouseenter={cancelClose}
	onmouseleave={scheduleClose}
	role="presentation"
>
	{#if tooltipState.open}
		<div
			id={tooltipState.id}
			role="tooltip"
			transition:flyAndScale={{ duration: 140 }}
			class={cn(
				className,
				'bg-[var(--color-tooltip)] text-[var(--color-tooltip-foreground)] rounded-[var(--tooltip-radius)] px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] shadow-[var(--shadow-sm)] pointer-events-auto max-w-[18rem] rounded-md border border-border/70 px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] text-[0.72rem] font-medium shadow-sm'
			)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
