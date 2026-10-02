import { describe, expect, test } from 'bun:test';

import { componentStatuses } from './status';

describe('componentStatuses', () => {
    test('flags a component behind the registry', async () => {
        const statuses = await componentStatuses({ button: '1.0.0' });

        expect(statuses).toHaveLength(1);
        expect(statuses[0].name).toBe('button');
        expect(statuses[0].outdated).toBe(statuses[0].installed !== statuses[0].latest);
    });

    test('sorts results by name', async () => {
        const statuses = await componentStatuses({ tooltip: '1.0.0', accordion: '1.0.0' });

        expect(statuses.map((entry) => entry.name)).toEqual(['accordion', 'tooltip']);
    });

    test('returns nothing for an empty config', async () => {
        expect(await componentStatuses({})).toEqual([]);
    });
});
