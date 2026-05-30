import { describe, expect, it } from 'vitest';
import { defaultSpacing } from '@silk/ui/themes/presets';
import { spacingGroups } from '$lib/components/themes/studio/spacing-fields';

// Phase 4 invariant: every editable spacing token has exactly one Studio control,
// and every control maps to a real token. This is the "no orphan tokens / no dead
// controls" guarantee — if a token is added to the schema or a control is removed,
// this test fails until they line up again.
describe('Studio spacing controls cover the schema 1:1', () => {
	const controlKeys = spacingGroups.flatMap((g) => g.fields.map((f) => f.key));
	const schemaKeys = Object.keys(defaultSpacing);

	it('exposes a control for every defaultSpacing token (no orphan tokens)', () => {
		const missing = schemaKeys.filter((k) => !controlKeys.includes(k as never));
		expect(missing, `tokens without a control: ${missing.join(', ')}`).toEqual([]);
	});

	it('every control maps to a real token (no dead controls)', () => {
		const unknown = controlKeys.filter((k) => !schemaKeys.includes(k));
		expect(unknown, `controls without a token: ${unknown.join(', ')}`).toEqual([]);
	});

	it('has no duplicate control for any token', () => {
		const seen = new Set<string>();
		const dupes = controlKeys.filter((k) => (seen.has(k) ? true : (seen.add(k), false)));
		expect(dupes, `duplicated controls: ${dupes.join(', ')}`).toEqual([]);
	});

	it('each control declares a valid min < max range', () => {
		for (const group of spacingGroups) {
			for (const f of group.fields) {
				expect(f.min, `${f.key} min<max`).toBeLessThan(f.max);
			}
		}
	});
});
