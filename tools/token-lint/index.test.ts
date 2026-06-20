// tools/token-lint/index.test.ts
import { describe, expect, it } from 'vitest';
import { lintSource } from './index';

describe('lintSource', () => {
	it('flags a hardcoded hex color', () => {
		const v = lintSource('a.svelte', 'class="bg-[#ff0000]"');
		expect(v).toHaveLength(1);
		expect(v[0].rule).toBe('no-literal-color');
	});

	it('flags a hardcoded px length in an arbitrary value', () => {
		const v = lintSource('a.svelte', 'class="h-[2px]"');
		expect(v.map((x) => x.rule)).toContain('no-literal-length');
	});

	it('flags direct use of a Tier-1 primitive', () => {
		const v = lintSource('a.svelte', 'class="text-[var(--silk-neutral-900)]"');
		expect(v.map((x) => x.rule)).toContain('no-primitive-leak');
	});

	it('passes clean token-only usage', () => {
		const v = lintSource('a.svelte', 'class="bg-[var(--color-card)] rounded-[var(--radius-lg)]"');
		expect(v).toEqual([]);
	});

	it('reports the correct line number for a violation on a later line', () => {
		// only scans the text it is handed; reports 1-based line numbers
		const v = lintSource('a.svelte', 'line1\nclass="h-[8px]"');
		expect(v[0].line).toBe(2);
	});
});
