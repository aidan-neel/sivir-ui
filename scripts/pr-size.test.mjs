import { describe, expect, test } from 'bun:test';
import { parseChangedFiles, sizeLabel } from './pr-size.mjs';

function changed(path, changedLines) {
    return {
        path,
        changedLines
    };
}

describe('sizeLabel', () => {
    test('labels a small source change as XS', () => {
        const files = [changed('packages/sivir/src/button.svelte', 9)];

        expect(sizeLabel(files)).toBe('size:XS');
    });

    test('labels a change at a limit with the next size up', () => {
        const files = [changed('packages/sivir/src/button.svelte', 100)];

        expect(sizeLabel(files)).toBe('size:L');
    });

    test('labels anything from 1000 lines as XXL', () => {
        const files = [changed('apps/docs/src/routes/+page.svelte', 1000)];

        expect(sizeLabel(files)).toBe('size:XXL');
    });

    test('ignores the lockfile and the built registry', () => {
        const files = [
            changed('bun.lock', 5000),
            changed('packages/sivir/registry/button.json', 800),
            changed('package.json', 2)
        ];

        expect(sizeLabel(files)).toBe('size:XS');
    });

    test('ignores tests when source also changed', () => {
        const files = [
            changed('packages/sivir/src/select.svelte', 20),
            changed('packages/sivir/src/select.test.ts', 600),
            changed('apps/docs/tests/select.spec.ts', 300)
        ];

        expect(sizeLabel(files)).toBe('size:S');
    });

    test('sizes a test-only change by its tests', () => {
        const files = [
            changed('apps/docs/src/lib/preview.test.ts', 120),
            changed('apps/registry/tests/themes.ts', 40)
        ];

        expect(sizeLabel(files)).toBe('size:L');
    });
});

describe('parseChangedFiles', () => {
    test('adds additions and deletions and skips blank lines', () => {
        const lines = [
            '{"filename":"AGENTS.md","additions":7,"deletions":3}',
            '',
            '{"filename":"bun.lock","additions":1,"deletions":0}'
        ];

        expect(parseChangedFiles(lines)).toEqual([
            changed('AGENTS.md', 10),
            changed('bun.lock', 1)
        ]);
    });
});
