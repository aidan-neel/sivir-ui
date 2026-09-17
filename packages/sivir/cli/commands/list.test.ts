import { describe, expect, test } from 'bun:test';

import type { RegistryComponent, RegistryTheme } from '../types';
import { formatList } from './list';

function component(name: string, description?: string): RegistryComponent {
    return {
        name,
        version: '1.0.0',
        visibility: 'public',
        description,
        files: [],
        components: [],
        shared: [],
        sharedFiles: [],
        peerDependencies: {}
    };
}

function theme(slug: string): RegistryTheme {
    return { slug, name: `${slug} theme`, css: '' };
}

/** picocolors still emits escapes when the runner reports color support. */
const strip = (line: string) => Bun.stripANSI(line);

describe('formatList', () => {
    test('pads component and theme labels to one shared column', () => {
        const lines = formatList([component('button')], [theme('midnight-express')], 100).map(
            strip
        );

        expect(lines).toContain('  button            v1.0.0  ');
        expect(lines).toContain('  midnight-express  midnight-express theme');
    });

    test('truncates descriptions to the remaining terminal width', () => {
        const lines = formatList([component('button', 'a'.repeat(80))], [], 40).map(strip);

        expect(lines).toContain(`  button  v1.0.0  ${'a'.repeat(19)}…`);
    });

    test('pluralizes counts and drops the theme section when empty', () => {
        const lines = formatList([component('button')], [], 100).map(strip);

        expect(lines).toContain('  1 component');
        expect(lines.some((line) => line.includes('theme'))).toBe(false);
    });

    test('renders an empty registry without blowing up the column math', () => {
        const lines = formatList([], [], 100).map(strip);

        expect(lines).toContain('  0 components');
        expect(lines.every((line) => !line.includes('Infinity'))).toBe(true);
    });
});
