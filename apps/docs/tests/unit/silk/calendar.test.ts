import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Calendar from '@silk/ui/components/calendar/calendar.svelte';

/*
 * Calendar has no arrow-key keyboard navigation (no onkeydown handlers).
 * Logged as P3-F10. Browser-runner was considered per Sprint 3 direction
 * but is unnecessary in jsdom for the actual implementation surface.
 */

describe('Calendar -- rendering', () => {
	it('renders a grid with 42 cells', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15) }
		});
		const cells = container.querySelectorAll('[role="gridcell"]');
		expect(cells.length).toBe(42);
	});

	it('renders the month/year header', () => {
		render(Calendar, { props: { value: new Date(2026, 0, 15) } });
		expect(screen.getByText(/January.*2026/)).toBeInTheDocument();
	});

	it('renders weekday labels (7 total)', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15) }
		});
		const grid = container.querySelector('[role="grid"]')!;
		const weekdayRow = grid.previousElementSibling!;
		expect(weekdayRow.children.length).toBe(7);
	});
});

describe('Calendar -- month navigation', () => {
	it('advances to next month on Next button click', async () => {
		render(Calendar, { props: { value: new Date(2026, 0, 15) } });
		expect(screen.getByText(/January.*2026/)).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByLabelText('Next month'));

		expect(screen.getByText(/February.*2026/)).toBeInTheDocument();
	});

	it('returns to previous month on Prev button click', async () => {
		render(Calendar, { props: { value: new Date(2026, 0, 15) } });

		const user = userEvent.setup();
		await user.click(screen.getByLabelText('Previous month'));

		expect(screen.getByText(/December.*2025/)).toBeInTheDocument();
	});

	it('crosses years correctly when advancing past December', async () => {
		render(Calendar, { props: { value: new Date(2026, 11, 15) } });
		expect(screen.getByText(/December.*2026/)).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByLabelText('Next month'));

		expect(screen.getByText(/January.*2027/)).toBeInTheDocument();
	});
});

describe('Calendar -- selection', () => {
	it('marks the selected date with aria-selected="true"', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15) }
		});
		const selected = container.querySelectorAll(
			'[role="gridcell"][aria-selected="true"]'
		);
		expect(selected.length).toBe(1);
	});

	it('fires onValueChange when a date is clicked', async () => {
		const onValueChange = vi.fn();
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15), onValueChange }
		});

		// Find a day cell within the current month and click it.
		const inMonthCells = Array.from(
			container.querySelectorAll<HTMLButtonElement>('[role="gridcell"]')
		).filter((c) => !c.disabled && c.textContent?.trim() === '10');

		expect(inMonthCells.length).toBeGreaterThanOrEqual(1);

		const user = userEvent.setup();
		await user.click(inMonthCells[0]);

		expect(onValueChange).toHaveBeenCalled();
		const arg = onValueChange.mock.calls[0][0];
		expect(arg).toBeInstanceOf(Date);
		expect(arg.getDate()).toBe(10);
	});
});

describe('Calendar -- min/max range', () => {
	it('disables dates before min', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15), min: new Date(2026, 4, 10) }
		});
		const day5 = Array.from(
			container.querySelectorAll<HTMLButtonElement>('[role="gridcell"]')
		).find((c) => !c.classList.contains('text-foreground-muted/50') && c.textContent?.trim() === '5');
		expect(day5).toBeDefined();
		expect(day5).toBeDisabled();
	});

	it('disables dates after max', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15), max: new Date(2026, 4, 20) }
		});
		const day25 = Array.from(
			container.querySelectorAll<HTMLButtonElement>('[role="gridcell"]')
		).find((c) => !c.classList.contains('text-foreground-muted/50') && c.textContent?.trim() === '25');
		expect(day25).toBeDefined();
		expect(day25).toBeDisabled();
	});
});

describe('Calendar -- today marker', () => {
	it('marks today with aria-current="date"', () => {
		render(Calendar, { props: { value: new Date() } });
		const todayCell = document.querySelector(
			'[role="gridcell"][aria-current="date"]'
		);
		expect(todayCell).toBeInTheDocument();
	});
});

describe('Calendar -- weekStartsOn', () => {
	it('starts the week on Monday when weekStartsOn=1', () => {
		const { container } = render(Calendar, {
			props: { value: new Date(2026, 4, 15), weekStartsOn: 1 }
		});
		const grid = container.querySelector('[role="grid"]')!;
		const weekdayRow = grid.previousElementSibling!;
		// First weekday cell text should be Monday's narrow name.
		// Locale-specific; assert that it differs from default (Sunday-start).
		const firstWeekday = weekdayRow.children[0].textContent;
		expect(firstWeekday).toBeTruthy();
		// Verify by re-rendering with default weekStartsOn=0.
		const { container: container2 } = render(Calendar, {
			props: { value: new Date(2026, 4, 15) }
		});
		const grid2 = container2.querySelector('[role="grid"]')!;
		const weekdayRow2 = grid2.previousElementSibling!;
		expect(firstWeekday).not.toBe(weekdayRow2.children[0].textContent);
	});
});
