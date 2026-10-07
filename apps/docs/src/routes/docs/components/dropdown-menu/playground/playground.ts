export type DropdownMenuTriggerVariant = 'outline' | 'secondary' | 'ghost';

export type DropdownMenuTriggerSize = 'sm' | 'md' | 'lg';

export type DropdownMenuSettings = {
    variant: DropdownMenuTriggerVariant;
    size: DropdownMenuTriggerSize;
    disabled: boolean;
};

export const dropdownMenuDefaults: DropdownMenuSettings = {
    variant: 'outline',
    size: 'md',
    disabled: false
};

const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const TRIGGER = '<DropdownMenu.Trigger {variant} {size} {disabled}>';

function triggerTag(settings: DropdownMenuSettings) {
    const disabled = settings.disabled ? ' disabled' : '';

    return `<DropdownMenu.Trigger variant="${settings.variant}" size="${settings.size}"${disabled}>`;
}

export function dropdownMenuCode(source: string, settings: DropdownMenuSettings) {
    return source.replace(PROPS_BLOCK, '').replace(TRIGGER, triggerTag(settings));
}

export function changedDropdownMenuProps(settings: DropdownMenuSettings) {
    const keys: (keyof DropdownMenuSettings)[] = ['size', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== dropdownMenuDefaults[key];
    }).length;
}
