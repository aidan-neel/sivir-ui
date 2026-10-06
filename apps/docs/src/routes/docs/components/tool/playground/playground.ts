import type { ToolState } from '@sivir-ui/svelte/components/tool';

export type ToolSettings = {
    state: ToolState;
    open: boolean;
    durations: boolean;
};

export type ToolContent = {
    title: string;
    duration: string;
    action: string;
    callDuration: string | undefined;
    output: string[];
};

export const toolDefaults: ToolSettings = {
    state: 'complete',
    open: true,
    durations: true
};

export const toolContent: Record<ToolState, ToolContent> = {
    running: {
        title: 'Running 1 command',
        duration: '1.9s',
        action: 'Running',
        callDuration: undefined,
        output: ['✓ saves the theme preference']
    },
    complete: {
        title: 'Searched once, read 2 files, ran 1 command',
        duration: '4.2s',
        action: 'Run',
        callDuration: '3.1s',
        output: [
            '✓ saves the theme preference',
            '✓ restores preferences after sign-in',
            '2 passed in 3.08s'
        ]
    },
    error: {
        title: 'Searched once, read 2 files, 1 command failed',
        duration: '4.2s',
        action: 'Run',
        callDuration: '3.1s',
        output: [
            '✓ saves the theme preference',
            '✗ restores preferences after sign-in',
            '1 passed, 1 failed in 3.08s'
        ]
    }
};

export const toolInput = JSON.stringify(
    {
        command: 'bun test preferences',
        cwd: 'apps/web'
    },
    null,
    2
);

function attributes(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function durationProp(settings: ToolSettings, duration: string | undefined) {
    if (!settings.durations || duration === undefined) {
        return [];
    }
    return [`duration="${duration}"`];
}

function rootProps(settings: ToolSettings) {
    const props: string[] = [];

    if (settings.state !== 'running') {
        props.push(`state="${settings.state}"`);
    }
    if (settings.open) {
        props.push('open');
    }
    props.push('class="w-full max-w-xl"');

    return attributes(props);
}

function callProps(settings: ToolSettings, content: ToolContent) {
    const props = [`action="${content.action}"`, 'target="bun test preferences"'];

    if (settings.state !== 'complete') {
        props.push(`state="${settings.state}"`);
    }
    props.push(...durationProp(settings, content.callDuration));

    return attributes(props);
}

function staticCall(settings: ToolSettings, action: string, target: string, duration: string) {
    const props = [`action="${action}"`, `target="${target}"`];

    props.push(...durationProp(settings, duration));

    return `<Tool.Call${attributes(props)} />`;
}

export function toolCode(settings: ToolSettings) {
    const content = toolContent[settings.state];
    const output = content.output
        .map((line) => {
            return `        '${line}'`;
        })
        .join(',\n');
    const triggerProps = attributes([
        `title="${content.title}"`,
        ...durationProp(settings, content.duration)
    ]);

    return `<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';

    const input = JSON.stringify(
        {
            command: 'bun test preferences',
            cwd: 'apps/web'
        },
        null,
        2
    );
    const output = [
${output}
    ].join('\\n');
</script>

<Tool.Root${rootProps(settings)}>
    <Tool.Trigger${triggerProps} />
    <Tool.Content>
        ${staticCall(settings, 'Search', 'usePreferences', '84ms')}
        ${staticCall(settings, 'Read file', 'src/lib/preferences.ts', '12ms')}
        ${staticCall(settings, 'Read file', 'src/routes/settings/+page.svelte', '9ms')}
        <Tool.Call${callProps(settings, content)}>
            <Tool.Output>
                <pre class="font-mono text-xs leading-5">{output}</pre>
            </Tool.Output>
            <Tool.Input>{input}</Tool.Input>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
`;
}

export function changedToolProps(settings: ToolSettings) {
    const keys = Object.keys(toolDefaults) as (keyof ToolSettings)[];

    return keys.filter((key) => {
        return settings[key] !== toolDefaults[key];
    }).length;
}
