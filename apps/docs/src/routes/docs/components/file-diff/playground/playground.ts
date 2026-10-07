import type { FileDiffTheme } from '@sivir-ui/svelte/components/file-diff';

export type FileDiffSettings = {
    showLineNumbers: boolean;
    theme: FileDiffTheme;
};

export const fileDiffDefaults: FileDiffSettings = {
    showLineNumbers: true,
    theme: 'sivir'
};

const LINE_WIDTH = 100;
const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const TYPE_IMPORT = 'import type { FileDiffLine, FileDiffTheme } from';
const ROOT_TAG =
    '<FileDiff.Root file="src/auth.ts" lang="ts" {diff} {showLineNumbers} {theme} class="max-w-2xl" />';

function rootProps(settings: FileDiffSettings) {
    const props = ['file="src/auth.ts"', 'lang="ts"', '{diff}'];

    if (!settings.showLineNumbers) {
        props.push('showLineNumbers={false}');
    }
    if (settings.theme !== fileDiffDefaults.theme) {
        props.push(`theme="${settings.theme}"`);
    }
    props.push('class="max-w-2xl"');

    return props;
}

function rootTag(settings: FileDiffSettings) {
    const props = rootProps(settings);
    const inline = `<FileDiff.Root ${props.join(' ')} />`;

    if (inline.length <= LINE_WIDTH) {
        return inline;
    }

    const stacked = props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    return `<FileDiff.Root\n${stacked}\n/>`;
}

export function fileDiffCode(source: string, settings: FileDiffSettings) {
    return source
        .replace(TYPE_IMPORT, 'import type { FileDiffLine } from')
        .replace(PROPS_BLOCK, '')
        .replace(ROOT_TAG, rootTag(settings));
}

export function changedFileDiffProps(settings: FileDiffSettings) {
    const keys = Object.keys(fileDiffDefaults) as (keyof FileDiffSettings)[];

    return keys.filter((key) => {
        return settings[key] !== fileDiffDefaults[key];
    }).length;
}
