export type CodeBlockCopy = 'none' | 'actionbar' | 'overlay';

export type CodeBlockSettings = {
    showLineNumbers: boolean;
    copy: CodeBlockCopy;
};

export const codeBlockDefaults: CodeBlockSettings = {
    showLineNumbers: false,
    copy: 'none'
};

export const codeBlockCopyOptions: {
    value: CodeBlockCopy;
    label: string;
}[] = [
    {
        value: 'none',
        label: 'None'
    },
    {
        value: 'actionbar',
        label: 'Action bar'
    },
    {
        value: 'overlay',
        label: 'Overlay'
    }
];

function contentProps(settings: CodeBlockSettings) {
    const props = ['value="ts"', '{code}', 'lang="typescript"'];

    if (settings.showLineNumbers) {
        props.push('showLineNumbers');
    }
    if (settings.copy === 'overlay') {
        props.push('copyPlacement="overlay"');
    }

    return props;
}

function contentMarkup(settings: CodeBlockSettings) {
    const props = contentProps(settings);

    if (props.length <= 3) {
        return `    <CodeBlock.Content ${props.join(' ')} />`;
    }

    const lines = props.map((prop) => {
        return `        ${prop}`;
    });

    return `    <CodeBlock.Content
${lines.join('\n')}
    />`;
}

function headerMarkup(settings: CodeBlockSettings) {
    if (settings.copy !== 'actionbar') {
        return '';
    }

    return `    <CodeBlock.Header>
        <CodeBlock.Actions />
    </CodeBlock.Header>
`;
}

export function codeBlockCode(settings: CodeBlockSettings) {
    return `<script lang="ts">
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

    const code = \`const greet = (name: string) => {
  return \\\`Hello, \\\${name}!\\\`;
};\`;
</script>

<CodeBlock.Root value="ts">
${headerMarkup(settings)}${contentMarkup(settings)}
</CodeBlock.Root>
`;
}

export function changedCodeBlockProps(settings: CodeBlockSettings) {
    const changes = [
        settings.showLineNumbers !== codeBlockDefaults.showLineNumbers,
        settings.copy !== codeBlockDefaults.copy
    ];

    return changes.filter(Boolean).length;
}
