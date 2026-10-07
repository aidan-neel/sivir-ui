export type TextareaVariant = 'outline' | 'secondary';

export type TextareaSettings = {
    variant: TextareaVariant;
    label: boolean;
    description: boolean;
    autoresize: boolean;
    disabled: boolean;
};

export const textareaDefaults: TextareaSettings = {
    variant: 'outline',
    label: true,
    description: false,
    autoresize: false,
    disabled: false
};

export const textareaContent = {
    label: 'Message',
    description: 'Everyone in #data-imports can read this.',
    value: 'The export finished, but three rows were skipped because their dates were empty. Can you check the source file?'
};

function textareaProps(settings: TextareaSettings) {
    const props = ['bind:value'];

    if (settings.variant !== textareaDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.label) {
        props.push(`label="${textareaContent.label}"`);
    } else {
        props.push(`aria-label="${textareaContent.label}"`);
    }
    if (settings.description) {
        props.push(`description="${textareaContent.description}"`);
    }
    if (settings.autoresize) {
        props.push('autoresize');
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    return props;
}

function textareaElement(props: string[]) {
    if (props.length <= 2) {
        return `    <Textarea ${props.join(' ')} />`;
    }

    const stacked = props
        .map((prop) => {
            return `        ${prop}`;
        })
        .join('\n');

    return `    <Textarea\n${stacked}\n    />`;
}

export function textareaCode(settings: TextareaSettings) {
    return `<script lang="ts">
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let value = $state(
        '${textareaContent.value}'
    );
</script>

<div class="w-full max-w-sm">
${textareaElement(textareaProps(settings))}
</div>
`;
}

export function changedTextareaProps(settings: TextareaSettings) {
    const keys = Object.keys(textareaDefaults).filter((key) => {
        return key !== 'variant';
    }) as (keyof TextareaSettings)[];

    return keys.filter((key) => {
        return settings[key] !== textareaDefaults[key];
    }).length;
}
