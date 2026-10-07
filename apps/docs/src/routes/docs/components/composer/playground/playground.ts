import type { ComposerStatus } from '@sivir-ui/svelte/components/composer';

export type ComposerToolbarVariant = 'chrome' | 'inset';

export type ComposerSettings = {
    status: ComposerStatus;
    generating: boolean;
    disabled: boolean;
    allowEmpty: boolean;
    submitOnEnter: boolean;
    toolbar: ComposerToolbarVariant;
};

export const composerDefaults: ComposerSettings = {
    status: 'idle',
    generating: false,
    disabled: false,
    allowEmpty: false,
    submitOnEnter: true,
    toolbar: 'chrome'
};

const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const STATUS_IMPORT =
    "    import type { ComposerStatus } from '@sivir-ui/svelte/components/composer';\n";
const LAST_STATE = '    let effort = $state(efforts[2]);\n';
const ROOT_INDENT = '\n        ';

function rootAttribute(name: keyof ComposerSettings, value: string | undefined) {
    return {
        token: `${ROOT_INDENT}{${name}}`,
        value: value === undefined ? '' : `${ROOT_INDENT}${value}`
    };
}

function rootAttributes(settings: ComposerSettings) {
    return [
        rootAttribute(
            'status',
            settings.status === composerDefaults.status ? undefined : `status="${settings.status}"`
        ),
        rootAttribute('disabled', settings.disabled ? 'disabled' : undefined),
        rootAttribute('allowEmpty', settings.allowEmpty ? 'allowEmpty' : undefined)
    ];
}

export function composerCode(source: string, settings: ComposerSettings) {
    const generating = `    let generating = $state(${settings.generating});\n`;
    const submitOnEnter = settings.submitOnEnter ? '' : ' submitOnEnter={false}';
    const toolbar =
        settings.toolbar === composerDefaults.toolbar ? '' : ` variant="${settings.toolbar}"`;

    let code = source
        .replace(STATUS_IMPORT, '')
        .replace(PROPS_BLOCK, '')
        .replace(LAST_STATE, `${LAST_STATE}${generating}`)
        .replace(' {submitOnEnter}', submitOnEnter)
        .replace(' variant={toolbar}', toolbar);

    for (const attribute of rootAttributes(settings)) {
        code = code.replace(attribute.token, attribute.value);
    }
    return code;
}

export function changedComposerProps(settings: ComposerSettings) {
    const keys = Object.keys(composerDefaults) as (keyof ComposerSettings)[];

    return keys.filter((key) => {
        return settings[key] !== composerDefaults[key];
    }).length;
}
