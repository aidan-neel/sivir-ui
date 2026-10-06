import type { QuestionStatus } from '@sivir-ui/svelte/components/question';

export type QuestionVariant = 'default' | 'inset';

export type QuestionSettings = {
    variant: QuestionVariant;
    status: QuestionStatus;
    disabled: boolean;
};

export const questionDefaults: QuestionSettings = {
    variant: 'inset',
    status: 'idle',
    disabled: false
};

const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const ROOT_TAG = /<Question\.Root\n {8}\{variant\}\n[\s\S]*?\n {4}>/;

function rootProps(settings: QuestionSettings) {
    const props: string[] = [];

    if (settings.variant !== 'default') {
        props.push(`variant="${settings.variant}"`);
    }
    props.push('bind:value={answers[step]}', 'required={!complete}');

    if (settings.status !== 'idle') {
        props.push(`status="${settings.status}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    props.push('onSubmit={next}');

    return props
        .map((prop) => {
            return `        ${prop}`;
        })
        .join('\n');
}

export function questionCode(source: string, settings: QuestionSettings) {
    return source
        .replace(PROPS_BLOCK, '')
        .replace(ROOT_TAG, `<Question.Root\n${rootProps(settings)}\n    >`);
}

export function changedQuestionProps(settings: QuestionSettings) {
    const keys: (keyof QuestionSettings)[] = ['status', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== questionDefaults[key];
    }).length;
}
