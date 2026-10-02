import { describe, expect, it } from 'vitest';
import {
    buildTokenIndex,
    collectRuleInputs,
    elementsUsingToken,
    extractVarNames,
    stripStateSelector,
    tokensForElement
} from '$lib/studio/token-usage';

describe('extractVarNames', () => {
    it('collects nested and spaced variable references once', () => {
        expect(extractVarNames('calc(var(--spacing) * 2) var( --a, var(--b)) var(--a)')).toEqual([
            '--spacing',
            '--a',
            '--b'
        ]);
    });
});

describe('stripStateSelector', () => {
    it.each([
        ['.hover\\:bg-x:hover', '.hover\\:bg-x'],
        ['.group-hover\\:x:is(:where(.group):hover *)', '.group-hover\\:x'],
        ['.data-\\[state\\=open\\]\\:bg-y[data-state="open"]', '.data-\\[state\\=open\\]\\:bg-y'],
        ['.dark\\:bg-z:where(.dark, .dark *)', '.dark\\:bg-z'],
        ['.x > :first-child', '.x > *'],
        ['.a::before', '.a'],
        ['[data-sivir-tooltip]', '[data-sivir-tooltip]'],
        ['.sivir-face[data-active="true"]', '.sivir-face[data-active="true"]']
    ])('strips %s', (selector, expected) => {
        expect(stripStateSelector(selector)).toBe(expected);
    });

    it('returns null when nothing anchors the selector', () => {
        expect(stripStateSelector(':root, :host')).toBeNull();
        expect(stripStateSelector('*')).toBeNull();
    });
});

describe('token index', () => {
    const editable = new Set(['--color-primary', '--color-error', '--elevation-1', '--radius-lg']);
    const index = buildTokenIndex(
        [
            {
                selector: null,
                cssText: '',
                customProperties: [
                    [
                        '--color-primary-hover',
                        'color-mix(in srgb, var(--color-primary) 90%, black)'
                    ],
                    ['--loop-a', 'var(--loop-b)'],
                    ['--loop-b', 'var(--loop-a)']
                ],
                definesRoot: true
            },
            {
                selector: '.shadow-error',
                cssText: '--tw-shadow: var(--color-error)',
                customProperties: [['--tw-shadow', 'var(--color-error)']],
                definesRoot: false
            },
            {
                selector: '.btn',
                cssText:
                    'background: var(--color-primary-hover); width: var(--loop-a); box-shadow: var(--tw-shadow)',
                customProperties: [],
                definesRoot: false
            },
            {
                selector: '.card',
                cssText: 'border-radius: var(--radius-lg)',
                customProperties: [],
                definesRoot: false
            }
        ],
        editable
    );

    it('resolves aliases to editable tokens and survives cycles', () => {
        expect([...index.resolve('--color-primary-hover')]).toEqual(['--color-primary']);
        expect([...index.resolve('--loop-a')]).toEqual([]);
    });

    it('only follows aliases defined on the root', () => {
        expect([...index.resolve('--tw-shadow')]).toEqual([]);
    });

    it('finds tokens from matching rules and inline styles', () => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.setAttribute('style', 'box-shadow: var(--elevation-1)');

        expect([...tokensForElement(index, button)].sort()).toEqual([
            '--color-primary',
            '--elevation-1'
        ]);
    });

    it('lists elements under a root that use a token', () => {
        const root = document.createElement('div');
        root.innerHTML =
            '<div class="card"></div><div class="card"></div><button class="btn"></button>';

        expect(elementsUsingToken(index, '--radius-lg', root)).toHaveLength(2);
        expect(elementsUsingToken(index, '--color-primary', root)).toHaveLength(1);
    });
});

describe('collectRuleInputs', () => {
    it('reads root definitions in every color mode and grouping rule', () => {
        const style = document.createElement('style');
        style.textContent = [
            ':root, .dark { --color-accent: var(--color-primary); }',
            '.dark { --color-surface: var(--color-error); }',
            '@media (min-width: 1px) { .panel { color: var(--color-accent); } }',
            '.dark .card { --tw-shadow: var(--color-error); }'
        ].join('\n');
        document.head.append(style);

        const sheet = style.sheet;
        expect(sheet).toBeTruthy();
        const inputs = collectRuleInputs(sheet ? [sheet] : []);
        style.remove();

        const definitions = inputs
            .filter((input) => input.definesRoot)
            .flatMap((input) => input.customProperties.map(([name]) => name));
        const index = buildTokenIndex(inputs, new Set(['--color-primary', '--color-error']));
        const panel = document.createElement('div');
        panel.className = 'panel';

        expect(definitions).toEqual(['--color-accent', '--color-surface']);
        expect([...index.resolve('--color-surface')]).toEqual(['--color-error']);
        expect([...tokensForElement(index, panel)]).toEqual(['--color-primary']);
    });
});
