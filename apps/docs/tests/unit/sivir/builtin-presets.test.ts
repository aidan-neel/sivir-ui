import { describe, expect, it } from 'vitest';
import { themesV2 } from '@sivir/ui/themes/builtin-presets';

describe('themesV2', () => {
	it('ships exactly one default theme', () => {
		expect(themesV2).toHaveLength(1);
		expect(themesV2[0].slug).toBe('default');
	});
});
