import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Label from '@silk/ui/components/label/label.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));
}

describe('Label -- rendering', () => {
	it('renders a label element with data-ui="label"', () => {
		const { container } = render(Label, { props: { children: textSnippet('Email') } });
		const label = container.querySelector('label');
		expect(label).toBeInTheDocument();
		expect(label!.getAttribute('data-ui')).toBe('label');
	});

	it('renders snippet children', () => {
		const { container } = render(Label, { props: { children: textSnippet('Email') } });
		expect(container.querySelector('label')).toHaveTextContent('Email');
	});

	it('passes through the for attribute', () => {
		const { container } = render(Label, {
			props: { for: 'email-input', children: textSnippet('Email') }
		});
		expect(container.querySelector('label')).toHaveAttribute('for', 'email-input');
	});

	it('merges a custom class', () => {
		const { container } = render(Label, {
			props: { class: 'custom-label', children: textSnippet('Email') }
		});
		expect(container.querySelector('label')).toHaveClass('custom-label');
	});
});
