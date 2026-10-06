import type { AvatarProps } from '@sivir-ui/svelte/components/avatar';

export type AvatarSize = NonNullable<AvatarProps['size']>;

export type AvatarShape = NonNullable<AvatarProps['shape']>;

export type AvatarSettings = {
    size: AvatarSize;
    shape: AvatarShape;
    image: boolean;
};

export const avatarDefaults: AvatarSettings = {
    size: 'md',
    shape: 'circle',
    image: true
};

function rootProps(settings: AvatarSettings) {
    const props: string[] = [];

    if (settings.size !== 'md') {
        props.push(`size="${settings.size}"`);
    }
    if (settings.shape !== 'circle') {
        props.push(`shape="${settings.shape}"`);
    }
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function imageLine(settings: AvatarSettings) {
    if (!settings.image) {
        return '';
    }
    return '\n    <Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />';
}

export function avatarCode(settings: AvatarSettings) {
    return `<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
</script>

<Avatar.Root${rootProps(settings)}>${imageLine(settings)}
    <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
`;
}

export function changedAvatarProps(settings: AvatarSettings) {
    const keys = Object.keys(avatarDefaults) as (keyof AvatarSettings)[];

    return keys.filter((key) => {
        return settings[key] !== avatarDefaults[key];
    }).length;
}
