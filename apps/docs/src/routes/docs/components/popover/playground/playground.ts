import type { Placement } from '@sivir-ui/svelte/components/popover';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverSettings = {
    side: PopoverSide;
    align: PopoverAlign;
    hoverable: boolean;
};

export const popoverDefaults: PopoverSettings = {
    side: 'bottom',
    align: 'center',
    hoverable: false
};

const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const ROOT_TAG = '<Popover.Root {placement} {hoverable}>';

export function popoverPlacement(settings: PopoverSettings): Placement {
    if (settings.align === 'center') {
        return settings.side;
    }
    return `${settings.side}-${settings.align}`;
}

function rootProps(settings: PopoverSettings) {
    const props: string[] = [];
    const placement = popoverPlacement(settings);

    if (placement !== 'bottom') {
        props.push(`placement="${placement}"`);
    }
    if (settings.hoverable) {
        props.push('hoverable');
    }
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

export function popoverCode(source: string, settings: PopoverSettings) {
    return source
        .replace(PROPS_BLOCK, '')
        .replace(ROOT_TAG, `<Popover.Root${rootProps(settings)}>`);
}

export function changedPopoverProps(settings: PopoverSettings) {
    const keys = Object.keys(popoverDefaults) as (keyof PopoverSettings)[];

    return keys.filter((key) => {
        return settings[key] !== popoverDefaults[key];
    }).length;
}
