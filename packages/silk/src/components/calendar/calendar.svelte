<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { tick } from 'svelte';
	import type { CalendarProps } from '.';

	let {
		class: className,
		value = $bindable<Date | undefined>(),
		min,
		max,
		weekStartsOn = 0,
		onValueChange,
		...rest
	}: CalendarProps = $props();

	const today = new Date();
	let viewMonth = $state(value?.getMonth() ?? today.getMonth());
	let viewYear = $state(value?.getFullYear() ?? today.getFullYear());

	const monthName = $derived(
		new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric'
		})
	);

	const weekdays = $derived.by(() => {
		const base = new Date(2024, 0, 7); // a Sunday
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(base);
			d.setDate(base.getDate() + ((i + weekStartsOn) % 7));
			return d.toLocaleDateString(undefined, { weekday: 'narrow' });
		});
	});

	const grid = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		const leading = (first.getDay() - weekStartsOn + 7) % 7;
		const cells: { date: Date; inMonth: boolean }[] = [];

		// trailing days of previous month
		const prevDays = new Date(viewYear, viewMonth, 0).getDate();
		for (let i = leading - 1; i >= 0; i--) {
			cells.push({
				date: new Date(viewYear, viewMonth - 1, prevDays - i),
				inMonth: false
			});
		}
		for (let d = 1; d <= daysInMonth; d++) {
			cells.push({ date: new Date(viewYear, viewMonth, d), inMonth: true });
		}
		while (cells.length % 7 !== 0 || cells.length < 42) {
			const last = cells[cells.length - 1].date;
			const next = new Date(last);
			next.setDate(last.getDate() + 1);
			cells.push({ date: next, inMonth: next.getMonth() === viewMonth });
			if (cells.length >= 42) break;
		}
		return cells;
	});

	function isSameDay(a: Date, b: Date) {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	function inRange(d: Date) {
		if (min && d < startOfDay(min)) return false;
		if (max && d > endOfDay(max)) return false;
		return true;
	}
	function startOfDay(d: Date) {
		const x = new Date(d);
		x.setHours(0, 0, 0, 0);
		return x;
	}
	function endOfDay(d: Date) {
		const x = new Date(d);
		x.setHours(23, 59, 59, 999);
		return x;
	}

	function go(delta: number) {
		const next = new Date(viewYear, viewMonth + delta, 1);
		viewMonth = next.getMonth();
		viewYear = next.getFullYear();
	}

	function pick(d: Date) {
		if (!inRange(d)) return;
		value = d;
		onValueChange?.(d);
	}

	// ── Keyboard navigation (WAI-ARIA grid pattern) ──────────────────────
	// One focusable cell at a time per WAI-ARIA roving-tabindex pattern.
	// Focused date starts at the selected value, else today, else first of view.
	let focusedDate = $state<Date>(value ?? today);
	let gridEl = $state<HTMLDivElement | undefined>();

	function dateKey(d: Date): string {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	async function moveFocus(delta: number, unit: 'day' | 'week' | 'month' | 'year') {
		const next = new Date(focusedDate);
		if (unit === 'day') next.setDate(next.getDate() + delta);
		else if (unit === 'week') next.setDate(next.getDate() + delta * 7);
		else if (unit === 'month') next.setMonth(next.getMonth() + delta);
		else if (unit === 'year') next.setFullYear(next.getFullYear() + delta);

		if (!inRange(next)) return;
		focusedDate = next;
		if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
			viewMonth = next.getMonth();
			viewYear = next.getFullYear();
		}
		// Focus the cell after Svelte re-renders the grid.
		await tick();
		const cell = gridEl?.querySelector<HTMLElement>(`[data-date="${dateKey(focusedDate)}"]`);
		cell?.focus();
	}

	async function moveToWeekEdge(side: 'start' | 'end') {
		const dow = (focusedDate.getDay() - weekStartsOn + 7) % 7;
		const next = new Date(focusedDate);
		next.setDate(next.getDate() + (side === 'start' ? -dow : 6 - dow));
		if (!inRange(next)) return;
		focusedDate = next;
		if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
			viewMonth = next.getMonth();
			viewYear = next.getFullYear();
		}
		await tick();
		const cell = gridEl?.querySelector<HTMLElement>(`[data-date="${dateKey(focusedDate)}"]`);
		cell?.focus();
	}

	function handleGridKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				void moveFocus(-1, 'day');
				return;
			case 'ArrowRight':
				event.preventDefault();
				void moveFocus(1, 'day');
				return;
			case 'ArrowUp':
				event.preventDefault();
				void moveFocus(-1, 'week');
				return;
			case 'ArrowDown':
				event.preventDefault();
				void moveFocus(1, 'week');
				return;
			case 'Home':
				event.preventDefault();
				void moveToWeekEdge('start');
				return;
			case 'End':
				event.preventDefault();
				void moveToWeekEdge('end');
				return;
			case 'PageUp':
				event.preventDefault();
				void moveFocus(event.shiftKey ? -1 : -1, event.shiftKey ? 'year' : 'month');
				return;
			case 'PageDown':
				event.preventDefault();
				void moveFocus(event.shiftKey ? 1 : 1, event.shiftKey ? 'year' : 'month');
				return;
		}
	}
</script>

<div
	data-ui="calendar"
	class={cn(
		'inline-flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-[var(--calendar-padding)]',
		className
	)}
	{...rest}
>
	<div class="flex items-center justify-between gap-2">
		<button
			type="button"
			aria-label="Previous month"
			onclick={() => go(-1)}
			class="inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
		>
			<ChevronLeft size={14} />
		</button>
		<span
			class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground"
			>{monthName}</span
		>
		<button
			type="button"
			aria-label="Next month"
			onclick={() => go(1)}
			class="inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
		>
			<ChevronRight size={14} />
		</button>
	</div>

	<div
		class="grid grid-cols-7 gap-[var(--calendar-grid-gap)] text-center [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] uppercase text-foreground-muted"
	>
		{#each weekdays as w, i (i)}
			<span>{w}</span>
		{/each}
	</div>

	<div
		bind:this={gridEl}
		role="grid"
		class="grid grid-cols-7 gap-[var(--calendar-grid-gap)]"
		onkeydown={handleGridKeydown}
	>
		{#each grid as cell, i (i)}
			{@const selected = value ? isSameDay(cell.date, value) : false}
			{@const isToday = isSameDay(cell.date, today)}
			{@const allowed = inRange(cell.date)}
			{@const focused = isSameDay(cell.date, focusedDate)}
			<button
				type="button"
				role="gridcell"
				data-date={dateKey(cell.date)}
				aria-selected={selected}
				aria-current={isToday ? 'date' : undefined}
				disabled={!allowed}
				tabindex={focused ? 0 : -1}
				onclick={() => {
					pick(cell.date);
					focusedDate = cell.date;
				}}
				class={cn(
					'inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] [font-size:calc(var(--font-size-button,14px)*0.937)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-30',
					!cell.inMonth && 'text-foreground-muted/50',
					cell.inMonth && !selected && 'text-foreground hover:bg-secondary',
					selected && 'bg-primary text-foreground-opposite',
					isToday && !selected && 'ring-1 ring-border-strong'
				)}
			>
				{cell.date.getDate()}
			</button>
		{/each}
	</div>
</div>
