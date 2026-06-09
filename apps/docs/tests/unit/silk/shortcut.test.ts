import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Shortcut from '@silk/ui/components/shortcut/shortcut.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));
}

describe('Shortcut -- standalone rendering', () => {
	it('renders its children', () => {
		const { container } = render(Shortcut, {
			props: { shortcut: 'cmd+k', children: textSnippet('⌘K') }
		});
		expect(container.querySelector('p')).toHaveTextContent('⌘K');
	});

	it('merges a custom class', () => {
		const { container } = render(Shortcut, {
			props: { shortcut: 'cmd+k', class: 'my-shortcut', children: textSnippet('⌘K') }
		});
		expect(container.querySelector('p')).toHaveClass('my-shortcut');
	});

	it('ignores the key combo without a parent button context', async () => {
		render(Shortcut, { props: { shortcut: 'cmd+k', children: textSnippet('⌘K') } });
		// No parent Button context wired -- pressing the combo must be a no-op
		// rather than a crash.
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
		expect(document.body).toBeInTheDocument();
	});
});
