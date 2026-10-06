<script lang="ts">
    import Frame from '@lucide/svelte/icons/frame';
    import MessageCircle from '@lucide/svelte/icons/message-circle';
    import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
    import PenTool from '@lucide/svelte/icons/pen-tool';
    import Square from '@lucide/svelte/icons/square';
    import Type from '@lucide/svelte/icons/type';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import type { TooltipSettings } from '../playground/playground';

    let { placement, delay, showOnClick, shortcut }: TooltipSettings = $props();

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
            <Tooltip.Root {placement} delay={Number(delay)}>
                <Tooltip.Trigger {showOnClick}>
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
                {#if shortcut}
                    <Tooltip.Content>
                        <div class="flex items-center gap-2">
                            <span>{tool.label}</span>
                            <Shortcut shortcut={tool.shortcut} />
                        </div>
                    </Tooltip.Content>
                {:else}
                    <Tooltip.Content>{tool.label}</Tooltip.Content>
                {/if}
            </Tooltip.Root>
        {/each}
    </div>
</div>
