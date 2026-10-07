export type SheetSide = 'left' | 'right';

export type SheetSettings = {
    side: SheetSide;
    allowClickOutside: boolean;
};

export const sheetDefaults: SheetSettings = {
    side: 'right',
    allowClickOutside: true
};

const PROPS_BLOCK = /\n {4}let \{\n[\s\S]*?\n {4}\} = \$props\(\);\n/;
const CONTENT_TAG = '<Sheet.Content {side} {allowClickOutside}>';

function contentProps(settings: SheetSettings) {
    const props: string[] = [];

    if (settings.side !== sheetDefaults.side) {
        props.push(`side="${settings.side}"`);
    }
    if (!settings.allowClickOutside) {
        props.push('allowClickOutside={false}');
    }
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

export function sheetCode(source: string, settings: SheetSettings) {
    return source
        .replace(PROPS_BLOCK, '')
        .replace(CONTENT_TAG, `<Sheet.Content${contentProps(settings)}>`);
}

export function changedSheetProps(settings: SheetSettings) {
    const keys = Object.keys(sheetDefaults) as (keyof SheetSettings)[];

    return keys.filter((key) => {
        return settings[key] !== sheetDefaults[key];
    }).length;
}
