import { mode } from 'mode-watcher';
import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['svelte', 'shell']
});
