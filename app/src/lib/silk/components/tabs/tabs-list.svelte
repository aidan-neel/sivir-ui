<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { getContext } from 'svelte';
	import type { TabsListProps, TabsState } from '.';

	let { children, class: className, ...rest }: TabsListProps = $props();
	const tabsState = getContext<TabsState>('tabs');

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
	role="tablist"
	aria-orientation={tabsState.orientation}
	data-ui="tabs-list"
	class={cn(
		className,
		'inline-flex items-center gap-0.5 rounded-[calc(var(--radius-lg)+1px)] border border-border bg-background p-[1px] shadow-[var(--outline-shadow)]'
	)}
	onkeydown={handleKeydown}
	{...rest}
>
	{@render children?.()}
</div>
