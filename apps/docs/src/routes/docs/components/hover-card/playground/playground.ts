import type { HoverCardContentProps } from '@sivir-ui/svelte/components/hover-card';

export type HoverCardSide = NonNullable<HoverCardContentProps['side']>;

export type HoverCardAlign = NonNullable<HoverCardContentProps['align']>;

export type HoverCardOpenDelay = '0' | '200' | '500';

export type HoverCardCloseDelay = '0' | '150' | '500';

export type HoverCardSettings = {
    side: HoverCardSide;
    align: HoverCardAlign;
    openDelay: HoverCardOpenDelay;
    closeDelay: HoverCardCloseDelay;
};

export const hoverCardDefaults: HoverCardSettings = {
    side: 'bottom',
    align: 'center',
    openDelay: '200',
    closeDelay: '150'
};

function attributes(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function rootProps(settings: HoverCardSettings) {
    const props: string[] = [];

    if (settings.openDelay !== hoverCardDefaults.openDelay) {
        props.push(`openDelay={${settings.openDelay}}`);
    }
    if (settings.closeDelay !== hoverCardDefaults.closeDelay) {
        props.push(`closeDelay={${settings.closeDelay}}`);
    }
    return props;
}

function contentProps(settings: HoverCardSettings) {
    const props: string[] = [];

    if (settings.side !== hoverCardDefaults.side) {
        props.push(`side="${settings.side}"`);
    }
    if (settings.align !== hoverCardDefaults.align) {
        props.push(`align="${settings.align}"`);
    }
    return props;
}

export function hoverCardCode(settings: HoverCardSettings) {
    return `<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as HoverCard from '@sivir-ui/svelte/components/hover-card';
</script>

<HoverCard.Root${attributes(rootProps(settings))}>
    <HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
    <HoverCard.Content${attributes(contentProps(settings))}>
        <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between gap-3">
                <Avatar.Root size="lg">
                    <Avatar.Fallback>AN</Avatar.Fallback>
                </Avatar.Root>
                <Button>Follow</Button>
            </div>

            <div class="flex flex-col gap-0.5">
                <HoverCard.Title>Aidan Neel</HoverCard.Title>
                <p class="text-sm text-foreground-muted">@aidan-neel · Seattle, WA</p>
            </div>

            <HoverCard.Description>
                Building Sivir, a themeable Svelte component library.
            </HoverCard.Description>

            <p class="flex gap-4 text-sm text-foreground-muted">
                <span>
                    <span class="font-medium tabular-nums text-foreground">1.2k</span>
                    followers
                </span>
                <span>
                    <span class="font-medium tabular-nums text-foreground">89</span>
                    following
                </span>
            </p>
        </div>
    </HoverCard.Content>
</HoverCard.Root>
`;
}

export function changedHoverCardProps(settings: HoverCardSettings) {
    const keys = Object.keys(hoverCardDefaults) as (keyof HoverCardSettings)[];

    return keys.filter((key) => {
        return settings[key] !== hoverCardDefaults[key];
    }).length;
}
