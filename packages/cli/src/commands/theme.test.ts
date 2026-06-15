import { describe, expect, test } from 'bun:test';
import { preset } from '../../../silk/src/themes/presets/default';
import { looksLikeUrl, themeCssFromResponse } from './theme';

describe('looksLikeUrl', () => {
	test('matches http(s) URLs', () => {
		expect(looksLikeUrl('https://themes.example.com/midnight')).toBe(true);
		expect(looksLikeUrl('http://localhost:3000/t.css')).toBe(true);
		expect(looksLikeUrl('  https://x.dev/y  ')).toBe(true);
	});

	test('rejects slugs', () => {
		expect(looksLikeUrl('default')).toBe(false);
		expect(looksLikeUrl('midnight-pro')).toBe(false);
		expect(looksLikeUrl('ftp://x.dev/y')).toBe(false);
	});
});

describe('themeCssFromResponse', () => {
	test('passes through ready-made CSS', () => {
		const css = '@theme {\n\t--color-primary: #fff;\n}';
		expect(themeCssFromResponse(css, 'text/css')).toBe(css);
	});

	test('renders a ThemeDraft JSON body to CSS', () => {
		const css = themeCssFromResponse(JSON.stringify(preset), 'application/json');
		expect(css).toContain('@theme');
		expect(css).toContain('--color-primary');
	});

	test('sniffs JSON from a leading brace when content-type is absent', () => {
		const css = themeCssFromResponse(JSON.stringify(preset), '');
		expect(css).toContain('@theme');
	});

	test('throws on malformed JSON', () => {
		expect(() => themeCssFromResponse('{ not json', 'application/json')).toThrow('invalid JSON');
	});
});
