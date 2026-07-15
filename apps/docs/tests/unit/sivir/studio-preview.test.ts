import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StudioPreview from '$lib/components/themes/studio/studio-preview.svelte';

// Acceptance: the Components preview screen must render a representative
// component from EVERY token group, so that every token has a live home in the
// preview. The screen is selected via the `preview` prop (driven by the studio
// toolbar's "Select preview" tabs); representative Sivir components expose
// `data-ui`, and menu/overlay triggers are asserted by their accessible label.
function renderComponents() {
	return render(StudioPreview, { props: { preview: 'components' } }).container;
}

describe('StudioPreview — token-group coverage', () => {
	it('renders a representative component for every token group on the Components screen', () => {
		const container = renderComponents();
		// Controls group — control geometry/state tokens.
		expect(
			container.querySelector('[data-ui="slider"]'),
			'missing slider (controls)'
		).not.toBeNull();
		// Text-input group — field tokens.
		expect(
			container.querySelector('[data-ui="textarea"]'),
			'missing textarea (inputs)'
		).not.toBeNull();
		// Surfaces group — card/surface padding, radius, elevation tokens.
		expect(container.querySelector('[data-ui="card"]'), 'missing card (surfaces)').not.toBeNull();
		expect(
			container.querySelector('[data-ui="progress"]'),
			'missing progress (feedback)'
		).not.toBeNull();
	});

	it('renders menu and modal/overlay representatives on the Components screen', () => {
		renderComponents();
		// Menus group — button-anchored floating surfaces.
		expect(screen.getByText('Dropdown')).toBeTruthy();
		expect(screen.getByText('Popover')).toBeTruthy();
		// Modals & transient group.
		expect(screen.getByText('Alert dialog')).toBeTruthy();
	});

	it('renders the requested screen for each preview tab', () => {
		expect(
			render(StudioPreview, { props: { preview: 'login' } }).getByText('Welcome back')
		).toBeTruthy();
		expect(
			render(StudioPreview, { props: { preview: 'dashboard' } }).getByText('Revenue this year')
		).toBeTruthy();
		expect(
			render(StudioPreview, { props: { preview: 'settings' } }).getByText('Workspace lifecycle')
		).toBeTruthy();
	});
});
