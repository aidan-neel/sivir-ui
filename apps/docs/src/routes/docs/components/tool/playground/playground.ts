import type { ToolState } from '@sivir-ui/svelte/components/tool';

export type ToolSettings = {
    running: boolean;
    failed: boolean;
    icons: boolean;
};

export type ToolContent = {
    summary: string;
    action: string;
    state: ToolState;
    output: string[];
};

export const toolDefaults: ToolSettings = {
    running: false,
    failed: false,
    icons: true
};

export const toolStatus = 'Running tests';

export const toolInput = JSON.stringify(
    {
        command: 'bun test preferences',
        cwd: 'apps/web'
    },
    null,
    2
);

export function toolContent(settings: ToolSettings): ToolContent {
    if (settings.running) {
        return {
            summary: 'Searched once, read 2 files, ran tests',
            action: 'Running',
            state: 'running',
            output: ['✓ saves the theme preference']
        };
    }
    if (settings.failed) {
        return {
            summary: 'Searched once, read 2 files, tests failed',
            action: 'Ran',
            state: 'error',
            output: [
                '✓ saves the theme preference',
                '✗ restores preferences after sign-in',
                '1 passed, 1 failed in 3.08s'
            ]
        };
    }

    return {
        summary: 'Searched once, read 2 files, ran tests',
        action: 'Ran',
        state: 'complete',
        output: [
            '✓ saves the theme preference',
            '✓ restores preferences after sign-in',
            '2 passed in 3.08s'
        ]
    };
}

function iconSnippet(settings: ToolSettings, icon: string, indent: string) {
    if (!settings.icons) {
        return '';
    }

    return `
${indent}    {#snippet icon()}<${icon} />{/snippet}`;
}

function staticCall(settings: ToolSettings, action: string, target: string, icon: string) {
    const props = `action="${action}" target="${target}"`;

    if (!settings.icons) {
        return `<Tool.Call ${props} />`;
    }

    return `<Tool.Call ${props}>${iconSnippet(settings, icon, '        ')}
        </Tool.Call>`;
}

function iconImports(settings: ToolSettings) {
    if (!settings.icons) {
        return '';
    }

    return `    import FileText from '@lucide/svelte/icons/file-text';
    import Search from '@lucide/svelte/icons/search';
    import Terminal from '@lucide/svelte/icons/terminal';
`;
}

export function toolCode(settings: ToolSettings) {
    const content = toolContent(settings);
    const output = content.output
        .map((line) => {
            return `        '${line}'`;
        })
        .join(',\n');
    const rootProps = settings.running ? 'running' : 'duration={4} open';
    const callState = content.state === 'complete' ? '' : ` state="${content.state}"`;

    return `<script lang="ts">
${iconImports(settings)}    import * as Tool from '@sivir-ui/svelte/components/tool';

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

<Tool.Root ${rootProps} class="w-full max-w-xl">
    <Tool.Trigger status="${toolStatus}" summary="${content.summary}" />
    <Tool.Content>
        ${staticCall(settings, 'Searched', 'usePreferences', 'Search')}
        ${staticCall(settings, 'Read', 'src/lib/preferences.ts', 'FileText')}
        ${staticCall(settings, 'Read', 'src/routes/settings/+page.svelte', 'FileText')}
        <Tool.Call action="${content.action}" target="bun test preferences"${callState} open>${iconSnippet(settings, 'Terminal', '        ')}
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
