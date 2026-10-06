export type MessagePlaygroundStatus = 'idle' | 'error';

export type MessageSettings = {
    status: MessagePlaygroundStatus;
    name: boolean;
    timestamp: boolean;
    avatar: boolean;
};

export type MessageEntry = {
    from: 'assistant' | 'user';
    name: string;
    timestamp: string;
    initials: string;
    text: string;
};

export const messageDefaults: MessageSettings = {
    status: 'idle',
    name: false,
    timestamp: false,
    avatar: false
};

export const messageEntries: MessageEntry[] = [
    {
        from: 'assistant',
        name: 'Sivir',
        timestamp: '9:41 AM',
        initials: 'SV',
        text: 'The deployment is healthy. Error rate and p95 latency are both below the rollback threshold.'
    },
    {
        from: 'user',
        name: 'Ada',
        timestamp: '9:42 AM',
        initials: 'AL',
        text: 'Keep monitoring until the 30-minute mark.'
    }
];

function rootProps(settings: MessageSettings, entry: MessageEntry) {
    const props = [`from="${entry.from}"`];

    if (entry.from === 'assistant' && settings.status !== messageDefaults.status) {
        props.push(`status="${settings.status}"`);
    }
    if (settings.name) {
        props.push(`name="${entry.name}"`);
    }
    if (settings.timestamp) {
        props.push(`timestamp="${entry.timestamp}"`);
    }
    return props;
}

function contentLines(entry: MessageEntry) {
    if (entry.from === 'assistant') {
        return [
            '        <Message.Content>',
            '            The deployment is healthy. Error rate and p95 latency are both below the rollback',
            '            threshold.',
            '        </Message.Content>'
        ];
    }
    return [`        <Message.Content>${entry.text}</Message.Content>`];
}

function avatarLines(entry: MessageEntry) {
    return [
        '        {#snippet avatar()}',
        '            <Avatar.Root size="sm">',
        `                <Avatar.Fallback>${entry.initials}</Avatar.Fallback>`,
        '            </Avatar.Root>',
        '        {/snippet}'
    ];
}

function messageBlock(settings: MessageSettings, entry: MessageEntry) {
    const lines = [`    <Message.Root ${rootProps(settings, entry).join(' ')}>`];

    if (settings.avatar) {
        lines.push(...avatarLines(entry));
    }
    lines.push(...contentLines(entry), '    </Message.Root>');

    return lines.join('\n');
}

export function messageCode(settings: MessageSettings) {
    const imports = settings.avatar
        ? [
              "    import * as Avatar from '@sivir-ui/svelte/components/avatar';",
              "    import * as Message from '@sivir-ui/svelte/components/message';"
          ]
        : ["    import * as Message from '@sivir-ui/svelte/components/message';"];
    const blocks = messageEntries
        .map((entry) => {
            return messageBlock(settings, entry);
        })
        .join('\n\n');

    return `<script lang="ts">
${imports.join('\n')}
</script>

<div class="w-full max-w-2xl space-y-7">
${blocks}
</div>
`;
}

export function changedMessageProps(settings: MessageSettings) {
    const keys = Object.keys(messageDefaults) as (keyof MessageSettings)[];

    return keys.filter((key) => {
        return settings[key] !== messageDefaults[key];
    }).length;
}
