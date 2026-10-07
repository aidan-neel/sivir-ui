export type ToastPlaygroundType = 'default' | 'success' | 'info' | 'warning' | 'error';

export type ToastPlaygroundDuration = '2000' | '5600' | '10000' | 'persistent';

export type ToastSettings = {
    type: ToastPlaygroundType;
    description: boolean;
    action: boolean;
    duration: ToastPlaygroundDuration;
    closeButton: boolean;
};

export type ToastContent = {
    title: string;
    description: string;
    action: 'visit' | 'retry';
};

export const toastDefaults: ToastSettings = {
    type: 'success',
    description: true,
    action: true,
    duration: '5600',
    closeButton: true
};

export const toastContent: Record<ToastPlaygroundType, ToastContent> = {
    default: {
        title: 'Deployment queued',
        description: 'sivir.dev starts building in a moment.',
        action: 'visit'
    },
    success: {
        title: 'Deployment ready',
        description: 'sivir.dev is now live.',
        action: 'visit'
    },
    info: {
        title: 'Deployment skipped',
        description: 'Nothing changed since the last build.',
        action: 'visit'
    },
    warning: {
        title: 'Deployed with warnings',
        description: 'Two pages exceeded the size budget.',
        action: 'visit'
    },
    error: {
        title: 'Deployment failed',
        description: 'The build exited with code 1.',
        action: 'retry'
    }
};

function indent(lines: string[], depth: number) {
    const pad = ' '.repeat(depth * 4);

    return lines.map((line) => {
        return `${pad}${line}`;
    });
}

function actionLines(content: ToastContent) {
    const callback =
        content.action === 'retry'
            ? ['callback: deploy']
            : ['callback: () => {', "    window.open('https://sivir.dev', '_blank');", '}'];
    const label = content.action === 'retry' ? 'Retry' : 'Visit';

    return [
        'actions: [',
        '    {',
        `        label: '${label}',`,
        ...indent(callback, 2),
        '    }',
        ']'
    ];
}

function optionEntries(settings: ToastSettings, content: ToastContent) {
    const entries: string[][] = [];

    if (settings.description) {
        entries.push([`description: '${content.description}'`]);
    }
    if (settings.action) {
        entries.push(actionLines(content));
    }
    if (settings.duration === 'persistent') {
        entries.push(['persistent: true']);
    } else if (settings.duration !== '5600') {
        entries.push([`duration: ${settings.duration}`]);
    }
    if (!settings.closeButton) {
        entries.push(['exitable: false']);
    }
    return entries;
}

function joinEntries(entries: string[][]) {
    return entries.flatMap((entry, index) => {
        if (index === entries.length - 1) {
            return entry;
        }
        const last = entry.length - 1;

        return entry.map((line, lineIndex) => {
            return lineIndex === last ? `${line},` : line;
        });
    });
}

function toastCall(settings: ToastSettings) {
    const content = toastContent[settings.type];
    const entries = optionEntries(settings, content);

    if (settings.type === 'default') {
        const body = joinEntries([[`title: '${content.title}'`], ...entries]);

        return ['toast({', ...indent(body, 1), '});'];
    }

    const call = `toast.${settings.type}('${content.title}'`;

    if (entries.length === 0) {
        return [`${call});`];
    }
    return [`${call}, {`, ...indent(joinEntries(entries), 1), '});'];
}

export function toastCode(settings: ToastSettings) {
    const body = indent(toastCall(settings), 2).join('\n');

    return `<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { toast } from '@sivir-ui/svelte/components/toast';

    function deploy() {
${body}
    }
</script>

<div class="flex items-center justify-center">
    <Button onclick={deploy}>Deploy</Button>
</div>
`;
}

export function changedToastProps(settings: ToastSettings) {
    const keys: (keyof ToastSettings)[] = ['description', 'action', 'duration', 'closeButton'];

    return keys.filter((key) => {
        return settings[key] !== toastDefaults[key];
    }).length;
}
