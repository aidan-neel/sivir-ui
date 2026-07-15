import { describe, expect, it, beforeEach } from 'vitest';
import { getCssDuration } from '@sivir/ui/internals/transition';

/*
 * getCssDuration reads CSS custom properties via getComputedStyle.
 * The tests below set inline styles on a real
 * element (jsdom) and assert the parsing branches.
 *
 * jsdom note: getComputedStyle for custom properties returns the
 * inline-style value verbatim. We rely on that -- these helpers
 * read CSS variables, not computed shorthand.
 */

describe('getCssDuration', () => {
	let node: HTMLDivElement;

	beforeEach(() => {
		node = document.createElement('div');
		document.body.appendChild(node);
	});

	it('returns fallback when variable is unset', () => {
		expect(getCssDuration(node, '--missing', 200)).toBe(200);
	});

	it('parses ms suffix', () => {
		node.style.setProperty('--d', '320ms');
		expect(getCssDuration(node, '--d', 0)).toBe(320);
	});

	it('parses s suffix and converts to ms', () => {
		node.style.setProperty('--d', '1.5s');
		expect(getCssDuration(node, '--d', 0)).toBe(1500);
	});

	it('parses unitless values as ms', () => {
		node.style.setProperty('--d', '240');
		expect(getCssDuration(node, '--d', 0)).toBe(240);
	});

	it('respects 0ms instead of treating it as falsy (commented as intentional in source)', () => {
		node.style.setProperty('--d', '0ms');
		expect(getCssDuration(node, '--d', 999)).toBe(0);
	});

	it('returns fallback for non-numeric values', () => {
		node.style.setProperty('--d', 'not-a-number');
		expect(getCssDuration(node, '--d', 200)).toBe(200);
	});

	it('returns fallback when the property is empty string', () => {
		node.style.setProperty('--d', '');
		expect(getCssDuration(node, '--d', 150)).toBe(150);
	});

	it('handles decimal ms values', () => {
		node.style.setProperty('--d', '150.5ms');
		expect(getCssDuration(node, '--d', 0)).toBe(150.5);
	});

	it('handles decimal seconds', () => {
		node.style.setProperty('--d', '0.25s');
		expect(getCssDuration(node, '--d', 0)).toBe(250);
	});
});
