export type ScrollAreaSettings = {
    showCues: boolean;
    blur: boolean;
};

export const scrollAreaDefaults: ScrollAreaSettings = {
    showCues: true,
    blur: false
};

function stackedTag(props: string[]) {
    const lines = props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    return `<ScrollArea\n${lines}\n>`;
}

export function scrollAreaCode(settings: ScrollAreaSettings) {
    const props: string[] = [];

    if (!settings.showCues) {
        props.push('showCues={false}');
    }
    if (settings.blur) {
        props.push('blur');
    }
    props.push('class="h-48 w-48 rounded-[var(--radius-md)] border border-border p-3"');

    const rootTag = props.length === 1 ? `<ScrollArea ${props[0]}>` : stackedTag(props);

    return `<script lang="ts">
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';

    const items = Array.from({ length: 10 }, (_, i) => {
        return \`Item \${i + 1}\`;
    });
</script>

${rootTag}
    <div class="space-y-2">
        {#each items as item (item)}
            <div class="text-sm">{item}</div>
        {/each}
    </div>
</ScrollArea>
`;
}

export function changedScrollAreaProps(settings: ScrollAreaSettings) {
    const keys = Object.keys(scrollAreaDefaults) as (keyof ScrollAreaSettings)[];

    return keys.filter((key) => {
        return settings[key] !== scrollAreaDefaults[key];
    }).length;
}
