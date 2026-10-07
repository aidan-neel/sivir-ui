export type CollapsibleSettings = {
    open: boolean;
    disabled: boolean;
};

export const collapsibleDefaults: CollapsibleSettings = {
    open: true,
    disabled: false
};

function rootProps(settings: CollapsibleSettings) {
    const props: string[] = [];

    if (settings.open) {
        props.push('open');
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

export function collapsibleCode(settings: CollapsibleSettings) {
    return `<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    const files = [
        'collapsible-trigger.svelte',
        'collapsible-content.svelte',
        'manifest.ts',
        '+page.svelte'
    ];
</script>

<div class="w-full max-w-md">
    <Collapsible.Root${rootProps(settings)}>
        <Collapsible.Trigger>{files.length} files changed</Collapsible.Trigger>
        <Collapsible.Content>
            <ul class="m-0 flex list-none flex-col gap-1.5 p-0">
                {#each files as file (file)}
                    <li class="truncate font-mono text-[0.875em] text-foreground">{file}</li>
                {/each}
            </ul>
        </Collapsible.Content>
    </Collapsible.Root>
</div>
`;
}

export function changedCollapsibleProps(settings: CollapsibleSettings) {
    const keys = Object.keys(collapsibleDefaults) as (keyof CollapsibleSettings)[];

    return keys.filter((key) => {
        return settings[key] !== collapsibleDefaults[key];
    }).length;
}
