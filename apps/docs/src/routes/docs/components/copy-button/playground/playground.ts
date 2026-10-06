export type CopyButtonVariant = 'ghost' | 'outline' | 'secondary';

export type CopyButtonSize = 'icon' | 'sm' | 'md' | 'lg';

export type CopyButtonSettings = {
    variant: CopyButtonVariant;
    size: CopyButtonSize;
    disabled: boolean;
};

export const copyButtonDefaults: CopyButtonSettings = {
    variant: 'ghost',
    size: 'icon',
    disabled: false
};

function buttonProps(settings: CopyButtonSettings) {
    const props = ['text="bun add @sivir-ui/svelte"'];

    if (settings.variant !== copyButtonDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.size !== copyButtonDefaults.size) {
        props.push(`size="${settings.size}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    return props.join(' ');
}

function buttonTag(settings: CopyButtonSettings) {
    const props = buttonProps(settings);

    if (settings.size === 'icon') {
        return `<CopyButton ${props} />`;
    }
    return `<CopyButton ${props}>Copy</CopyButton>`;
}

export function copyButtonCode(settings: CopyButtonSettings) {
    return `<script lang="ts">
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
</script>

${buttonTag(settings)}
`;
}

export function changedCopyButtonProps(settings: CopyButtonSettings) {
    const keys: (keyof CopyButtonSettings)[] = ['size', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== copyButtonDefaults[key];
    }).length;
}
