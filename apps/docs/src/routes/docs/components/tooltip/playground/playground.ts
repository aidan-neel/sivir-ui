import type { TooltipPlacement } from '@sivir-ui/svelte/components/tooltip';

export type TooltipDelay = '0' | '125' | '300' | '700';

export type TooltipSettings = {
    placement: TooltipPlacement;
    delay: TooltipDelay;
    showOnClick: boolean;
    shortcut: boolean;
};

export const tooltipDefaults: TooltipSettings = {
    placement: 'top',
    delay: '300',
    showOnClick: false,
    shortcut: true
};

function attributes(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function rootProps(settings: TooltipSettings) {
    const props: string[] = [];

    if (settings.placement !== 'top') {
        props.push(`placement="${settings.placement}"`);
    }
    if (settings.delay !== '125') {
        props.push(`delay={${settings.delay}}`);
    }
    return attributes(props);
}

function triggerProps(settings: TooltipSettings) {
    if (!settings.showOnClick) {
        return '';
    }
    return ' showOnClick';
}

function content(settings: TooltipSettings) {
    if (!settings.shortcut) {
        return '<Tooltip.Content>{tool.label}</Tooltip.Content>';
    }
    return `<Tooltip.Content>
                    <div class="flex items-center gap-2">
                        <span>{tool.label}</span>
                        <Shortcut shortcut={tool.shortcut} />
                    </div>
                </Tooltip.Content>`;
}

export function tooltipCode(settings: TooltipSettings) {
    const shortcutImport = settings.shortcut
        ? "\n    import Shortcut from '@sivir-ui/svelte/components/shortcut';"
        : '';

    return `<script lang="ts">
    import Frame from '@lucide/svelte/icons/frame';
    import MessageCircle from '@lucide/svelte/icons/message-circle';
    import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
    import PenTool from '@lucide/svelte/icons/pen-tool';
    import Square from '@lucide/svelte/icons/square';
    import Type from '@lucide/svelte/icons/type';${shortcutImport}
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';

    let activeTool = $state<string>('move');

    const tools = [
        { id: 'move', label: 'Move', shortcut: 'V', icon: MousePointer2 },
        { id: 'frame', label: 'Frame', shortcut: 'F', icon: Frame },
        { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: Square },
        { id: 'pen', label: 'Pen', shortcut: 'P', icon: PenTool },
        { id: 'text', label: 'Text', shortcut: 'T', icon: Type },
        { id: 'comment', label: 'Comment', shortcut: 'C', icon: MessageCircle }
    ];
</script>

<div class="flex items-center justify-center p-10">
    <div class="flex gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-1">
        {#each tools as tool (tool.id)}
            {@const Icon = tool.icon}
            <Tooltip.Root${rootProps(settings)}>
                <Tooltip.Trigger${triggerProps(settings)}>
                    <button
                        type="button"
                        class="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] transition-colors"
                        class:bg-secondary={activeTool === tool.id}
                        class:text-foreground={activeTool === tool.id}
                        class:text-foreground-muted={activeTool !== tool.id}
                        class:hover:bg-secondary={activeTool !== tool.id}
                        class:hover:text-foreground={activeTool !== tool.id}
                        onclick={() => {
                            activeTool = tool.id;
                        }}
                        aria-label={tool.label}
                    >
                        <Icon size={16} />
                    </button>
                </Tooltip.Trigger>
                ${content(settings)}
            </Tooltip.Root>
        {/each}
    </div>
</div>
`;
}

export function changedTooltipProps(settings: TooltipSettings) {
    const keys = Object.keys(tooltipDefaults) as (keyof TooltipSettings)[];

    return keys.filter((key) => {
        return settings[key] !== tooltipDefaults[key];
    }).length;
}
