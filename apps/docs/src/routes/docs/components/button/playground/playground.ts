import type { ButtonVariant } from '@sivir-ui/svelte/components/button';

export type PlaygroundExample = 'default' | 'leading' | 'trailing' | 'status' | 'link' | 'disabled';

export type PlaygroundSize = 'sm' | 'md' | 'lg';

export type PlaygroundSettings = {
    example: PlaygroundExample;
    variant: ButtonVariant;
    size: PlaygroundSize;
};

const BUTTON_IMPORT = "import { Button } from '@sivir-ui/svelte/components/button';";

function settingProps(settings: PlaygroundSettings) {
    const props: string[] = [];

    if (settings.variant !== 'primary') {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.size !== 'md') {
        props.push(`size="${settings.size}"`);
    }
    return props;
}

function inlineProps(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function stackedProps(props: string[]) {
    return props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');
}

function script(lines: string[]) {
    const body = lines
        .map((line) => {
            return line === '' ? '' : `    ${line}`;
        })
        .join('\n');

    return `<script lang="ts">\n${body}\n</script>`;
}

export function playgroundCode(settings: PlaygroundSettings) {
    const props = settingProps(settings);

    switch (settings.example) {
        case 'leading': {
            const imports = script([
                "import Plus from '@lucide/svelte/icons/plus';",
                BUTTON_IMPORT
            ]);

            return `${imports}

<Button${inlineProps(props)}>
    <Plus size={14} />
    New project
</Button>
`;
        }
        case 'trailing': {
            const imports = script([
                "import ArrowRight from '@lucide/svelte/icons/arrow-right';",
                BUTTON_IMPORT
            ]);

            return `${imports}

<Button${inlineProps(props)}>
    Continue
    <ArrowRight size={14} />
</Button>
`;
        }
        case 'status': {
            const imports = script([
                "import { Button, type ButtonStatus } from '@sivir-ui/svelte/components/button';",
                '',
                "let status = $state<ButtonStatus>('idle');",
                '',
                'async function publish() {',
                "    status = 'loading';",
                '    await new Promise((resolve) => setTimeout(resolve, 1000));',
                "    status = 'success';",
                '}'
            ]);
            const statusProps = stackedProps([
                '{status}',
                ...props,
                'loadingLabel="Publishing…"',
                'successLabel="Published"',
                'onclick={publish}'
            ]);

            return `${imports}

<Button
${statusProps}
>
    Publish
</Button>
`;
        }
        case 'link': {
            const imports = script([
                "import ExternalLink from '@lucide/svelte/icons/external-link';",
                BUTTON_IMPORT
            ]);

            return `${imports}

<Button${inlineProps(['href="/docs"', ...props])}>
    <ExternalLink size={13} />
    Open docs
</Button>
`;
        }
        case 'disabled': {
            return `${script([BUTTON_IMPORT])}

<Button${inlineProps([...props, 'disabled'])}>Get started</Button>
`;
        }
        default: {
            return `${script([BUTTON_IMPORT])}

<Button${inlineProps(props)}>Get started</Button>
`;
        }
    }
}
