<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { getContext, untrack } from 'svelte';
	import type { TabsListProps, TabsState } from '.';

	let { children, class: className, ...rest }: TabsListProps = $props();
	const tabsState = getContext<TabsState>('tabs');

	type Rect = { left: number; top: number; width: number; height: number };

	const variant = $derived(tabsState.variant);
	// `default` + `ghost` get the animated hover-highlight pill; `outlined` doesn't.
	const showHover = $derived(variant !== 'outlined');

	let listEl = $state<HTMLDivElement | undefined>(undefined);
	let indicator = $state<Rect | null>(null);
	let hover = $state<Rect | null>(null);
	let hovering = $state(false);
	let ready = $state(false);

	function rectOf(el: HTMLElement): Rect {
		// offsetLeft/Top are relative to the offsetParent's padding box, which is
		// exactly where `position:absolute` with `left/top:0` is anchored -- using
		// getBoundingClientRect diffs is off by the list's border width.
		return {
			left: el.offsetLeft,
			top: el.offsetTop,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	}

	function measureIndicator() {
		if (!listEl) return;
		const active = listEl.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
		indicator = active ? rectOf(active) : null;
	}

	function handleMouseOver(event: Event) {
		if (!showHover || !listEl) return;
		const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[role="tab"]');
		if (!target || target.hasAttribute('disabled') || !listEl.contains(target)) return;
		hover = rectOf(target);
		hovering = true;
	}

	function handleMouseLeave() {
		hovering = false;
	}

	// Slide geometry + (optionally) fade, driven by the theme's panel duration.
	const SLIDE =
		'left var(--motion-duration-panel) var(--ease-out),top var(--motion-duration-panel) var(--ease-out),width var(--motion-duration-panel) var(--ease-out),height var(--motion-duration-panel) var(--ease-out)';

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
	data-variant={variant}
	class={cn(
		className,
		'relative inline-flex items-center',
		variant === 'outlined' &&
			'rounded-[var(--radius-lg)] border border-border bg-secondary/40 p-[var(--tabs-list-padding)] shadow-[var(--outline-shadow)]',
		variant === 'ghost' && 'gap-1',
		// bottom padding = the visible gap between the tabs and the underline
		variant === 'default' && 'gap-1 pb-1'
	)}
	onkeydown={handleKeydown}
	onmouseover={handleMouseOver}
	onfocusin={handleMouseOver}
	onmouseleave={handleMouseLeave}
	onfocusout={handleMouseLeave}
	{...rest}
>
	<!-- Hover highlight (default + ghost). In `ghost` this is the ONLY fill -- the
	     active tab is shown through text color/weight, not a pill. -->
	{#if showHover && hover}
		<div
			aria-hidden="true"
			class={cn(
				'pointer-events-none absolute rounded-[var(--radius-md)]',
				variant === 'ghost' ? 'bg-secondary/70' : 'bg-foreground/[0.06]'
			)}
			style={`left:${hover.left}px;top:${hover.top}px;width:${hover.width}px;height:${hover.height}px;opacity:${hovering ? 1 : 0};transition:${SLIDE},opacity var(--motion-duration-hover) ease-out;`}
		></div>
	{/if}

	<!-- Active indicator -->
	{#if indicator}
		{#if variant === 'default'}
			<!-- 2px underline anchored to the bottom of the list; the gap below the tabs
			     is the list's bottom padding (pb-3 below), so it reads as a real underline -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute bottom-0 h-[var(--tabs-indicator-height)] rounded-full bg-foreground"
				style={`left:${indicator.left}px;width:${indicator.width}px;transition:${ready ? 'left var(--motion-duration-panel) var(--ease-out),width var(--motion-duration-panel) var(--ease-out)' : 'none'};`}
			></div>
		{:else if variant === 'outlined'}
			<!-- filled pill inside the bordered container -->
			<div
				aria-hidden="true"
				class="pointer-events-none absolute rounded-[calc(var(--radius-lg)-4px)] bg-secondary shadow-[var(--outline-shadow)]"
				style={`left:${indicator.left}px;top:${indicator.top}px;width:${indicator.width}px;height:${indicator.height}px;transition:${ready ? SLIDE : 'none'};`}
			></div>
		{/if}
	{/if}
	{@render children?.()}
</div>
