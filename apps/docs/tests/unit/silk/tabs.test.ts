import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TabsFixture from '../../fixtures/TabsFixture.svelte';

describe('Tabs -- rendering', () => {
	it('renders one trigger per tab', () => {
		render(TabsFixture, { props: { value: 'one' } });
		expect(screen.getByTestId('trig-one')).toBeInTheDocument();
		expect(screen.getByTestId('trig-two')).toBeInTheDocument();
		expect(screen.getByTestId('trig-three')).toBeInTheDocument();
	});

	it('renders only the active tab content', () => {
		render(TabsFixture, { props: { value: 'one' } });
		expect(screen.getByTestId('content-one')).toBeInTheDocument();
		expect(screen.queryByTestId('content-two')).not.toBeInTheDocument();
		expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
	});

	it('marks the active trigger with aria-selected="true"', () => {
		render(TabsFixture, { props: { value: 'two' } });
		const triggerTwo = screen.getByTestId('trig-two').closest('button')!;
		const triggerOne = screen.getByTestId('trig-one').closest('button')!;
		expect(triggerTwo.getAttribute('aria-selected')).toBe('true');
		expect(triggerOne.getAttribute('aria-selected')).toBe('false');
	});
});

describe('Tabs -- interaction', () => {
	it('switches active content on trigger click', async () => {
		render(TabsFixture, { props: { value: 'one' } });
		expect(screen.getByTestId('content-one')).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByTestId('trig-two'));

		expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
		expect(screen.getByTestId('content-two')).toBeInTheDocument();
	});

	it('does not switch when a disabled trigger is clicked', async () => {
		render(TabsFixture, { props: { value: 'one' } });

		const user = userEvent.setup();
		await user.click(screen.getByTestId('trig-three'));

		expect(screen.getByTestId('content-one')).toBeInTheDocument();
		expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
	});

	it('exposes aria-controls linking triggers to content', () => {
		render(TabsFixture, { props: { value: 'one' } });
		const trigger = screen.getByTestId('trig-one').closest('button')!;
		const ariaControls = trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();
		expect(document.getElementById(ariaControls!)).toBeTruthy();
	});
});

describe('Tabs -- orientation', () => {
	it('renders horizontal by default', () => {
		const { container } = render(TabsFixture, { props: { value: 'one' } });
		const root = container.querySelector('[data-ui]');
		expect(root).toBeInTheDocument();
	});

	it('accepts orientation="vertical" without throwing', () => {
		const { container } = render(TabsFixture, {
			props: { value: 'one', orientation: 'vertical' }
		});
		expect(container.querySelector('button')).toBeInTheDocument();
	});
});

describe('Tabs -- ARIA roles', () => {
	it('triggers use role="tab"', () => {
		render(TabsFixture, { props: { value: 'one' } });
		const tabs = document.querySelectorAll('[role="tab"]');
		expect(tabs.length).toBe(3);
	});

	it('content uses role="tabpanel"', () => {
		render(TabsFixture, { props: { value: 'one' } });
		const panel = document.querySelector('[role="tabpanel"]');
		expect(panel).toBeInTheDocument();
	});

	it('list uses role="tablist"', () => {
		render(TabsFixture, { props: { value: 'one' } });
		const list = document.querySelector('[role="tablist"]');
		expect(list).toBeInTheDocument();
	});
});
