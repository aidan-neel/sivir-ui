<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { getContext, untrack } from 'svelte';
	import type { TabsListProps, TabsState } from '.';

	let { children, class: className, ...rest }: TabsListProps = $props();
	const tabsState = getContext<TabsState>('tabs');

	let listEl = $state<HTMLDivElement | undefined>(undefined);
	let indicator = $state<{ left: number; top: number; width: number; height: number } | null>(
		null
	);
	let ready = $state(false);

	function measureIndicator() {
		if (!listEl) return;
		const active = listEl.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
		if (!active) {
			indicator = null;
			return;
		}
		// offsetLeft/Top are relative to the offsetParent's padding box, which is
		// exactly where `position:absolute` with `left/top:0` is anchored — using
		// getBoundingClientRect diffs is off by the list's border width.
		indicator = {
			left: active.offsetLeft,
			top: active.offsetTop,
			width: active.offsetWidth,
			height: active.offsetHeight
		};
	}

	$effect(() => {
		// re-measure whenever the active value changes
		const _ = tabsState.value;
		untrack(() => {
			// allow DOM to update first
			queueMicrotask(() => {
				measureIndicator();
				ready = true;
			});
		});
	});

	$effect(() => {
		if (!listEl) return;
		const ro = new ResizeObserver(() => measureIndicator());
		ro.observe(listEl);
		const triggers = listEl.querySelectorAll<HTMLElement>('[role="tab"]');
		triggers.forEach((el) => ro.observe(el));
		window.addEventListener('resize', measureIndicator);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measureIndicator);
		};
	});

	function moveFocus(current: HTMLElement, direction: 1 | -1) {
		const list = current.closest('[role="tablist"]');
		if (!list) return;
		const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
		const index = tabs.indexOf(current);
		if (index === -1) return;
		const next = tabs[(index + direction + tabs.length) % tabs.length];
		next?.focus();
		next?.click();
	}

	function handleKeydown(event: KeyboardEvent) {
		const target = event.target;
		if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
		const isHorizontal = tabsState.orientation === 'horizontal';
		if (event.key === 'Home') {
			event.preventDefault();
			const first = target
				.closest('[role="tablist"]')
				?.querySelector<HTMLElement>('[role="tab"]:not([disabled])');
			first?.focus();
			first?.click();
			return;
		}
		if (event.key === 'End') {
			event.preventDefault();
			const tabs = target
				.closest('[role="tablist"]')
				?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])');
			tabs?.[tabs.length - 1]?.focus();
			tabs?.[tabs.length - 1]?.click();
			return;
		}
		if (
			(isHorizontal && event.key === 'ArrowRight') ||
			(!isHorizontal && event.key === 'ArrowDown')
		) {
			event.preventDefault();
			moveFocus(target, 1);
		}
		if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
			event.preventDefault();
			moveFocus(target, -1);
		}
	}
</script>

<div
	bind:this={listEl}
	role="tablist"
	aria-orientation={tabsState.orientation}
	data-ui="tabs-list"
	class={cn(
		className,
		'relative inline-flex items-center rounded-[var(--radius-lg)] border border-border bg-secondary/40 p-[var(--tabs-list-padding)] shadow-[var(--outline-shadow)]'
	)}
	onkeydown={handleKeydown}
	{...rest}
>
	{#if indicator}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute rounded-[calc(var(--radius-lg)-4px)] bg-secondary shadow-[var(--outline-shadow)]"
			style={`left:${indicator.left}px;top:${indicator.top}px;width:${indicator.width}px;height:${indicator.height}px;transition:${ready ? 'left var(--motion-duration-panel) cubic-bezier(0.4,0,0.2,1),top var(--motion-duration-panel) cubic-bezier(0.4,0,0.2,1),width var(--motion-duration-panel) cubic-bezier(0.4,0,0.2,1),height var(--motion-duration-panel) cubic-bezier(0.4,0,0.2,1)' : 'none'};`}
		></div>
	{/if}
	{@render children?.()}
</div>
