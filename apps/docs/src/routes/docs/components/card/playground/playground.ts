export type CardVariant = 'default' | 'panel' | 'inset';

export type CardSettings = {
    variant: CardVariant;
    header: boolean;
    content: boolean;
    footer: boolean;
};

export const cardDefaults: CardSettings = {
    variant: 'default',
    header: true,
    content: true,
    footer: true
};

export const cardVariants: {
    value: CardVariant;
    label: string;
}[] = [
    {
        value: 'default',
        label: 'Default'
    },
    {
        value: 'panel',
        label: 'Panel'
    },
    {
        value: 'inset',
        label: 'Inset'
    }
];

const HEADER_CODE = `    <Card.Header>
        <div class="flex items-start justify-between gap-4">
            <Card.Title>sivir-ui</Card.Title>
            <span
                class="flex shrink-0 items-center gap-2 py-1 text-[length:var(--font-size-body)] font-medium text-foreground"
            >
                <span
                    class="size-2 rounded-full bg-[var(--color-success)]"
                    aria-hidden="true"
                ></span>
                Ready
            </span>
        </div>
        <Card.Description class="font-mono text-[0.875em]">sivir-ui.vercel.app</Card.Description>
    </Card.Header>`;

const CONTENT_CODE = `    <Card.Content>
        <dl
            class="m-0 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-3 text-[length:var(--font-size-body)]"
        >
            <dt class="text-foreground-muted">Environment</dt>
            <dd class="m-0 text-foreground">Production</dd>
            <dt class="text-foreground-muted">Branch</dt>
            <dd class="m-0 font-mono text-[0.875em] text-foreground">main</dd>
            <dt class="text-foreground-muted">Commit</dt>
            <dd class="m-0 flex min-w-0 items-baseline gap-2 text-foreground">
                <span class="shrink-0 font-mono text-[0.875em] text-foreground-muted">4f2a9c1</span>
                <span class="truncate">feat(studio): restore original styling</span>
            </dd>
            <dt class="text-foreground-muted">Deployed</dt>
            <dd class="m-0 text-foreground">
                <time datetime="2026-10-05T10:00:00Z">2 hours ago</time>
                by aidan-neel
            </dd>
        </dl>
    </Card.Content>`;

const FOOTER_CODE = `    <Card.Footer>
        <Button variant="outline" size="md">Visit</Button>
        <Button size="md">View deployment</Button>
    </Card.Footer>`;

function cardImports(settings: CardSettings) {
    const imports = ["    import * as Card from '@sivir-ui/svelte/components/card';"];

    if (settings.footer) {
        imports.unshift("    import { Button } from '@sivir-ui/svelte/components/button';");
    }

    return imports.join('\n');
}

function cardParts(settings: CardSettings) {
    const parts: string[] = [];

    if (settings.header) {
        parts.push(HEADER_CODE);
    }
    if (settings.content) {
        parts.push(CONTENT_CODE);
    }
    if (settings.footer) {
        parts.push(FOOTER_CODE);
    }

    return parts.join('\n');
}

function cardRootProps(settings: CardSettings) {
    if (settings.variant === 'default') {
        return 'class="w-full max-w-[28rem]"';
    }

    return `variant="${settings.variant}" class="w-full max-w-[28rem]"`;
}

function cardMarkup(settings: CardSettings) {
    const parts = cardParts(settings);

    if (parts === '') {
        return `<Card.Root ${cardRootProps(settings)} />`;
    }

    return `<Card.Root ${cardRootProps(settings)}>
${parts}
</Card.Root>`;
}

export function cardCode(settings: CardSettings) {
    return `<script lang="ts">
${cardImports(settings)}
</script>

${cardMarkup(settings)}
`;
}

export function changedCardProps(settings: CardSettings) {
    const changes = [
        settings.header !== cardDefaults.header,
        settings.content !== cardDefaults.content,
        settings.footer !== cardDefaults.footer
    ];

    return changes.filter(Boolean).length;
}
