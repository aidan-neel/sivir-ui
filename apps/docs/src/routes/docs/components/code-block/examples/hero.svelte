<script lang="ts">
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';

    let {
        showLineNumbers = false,
        copy = 'none'
    }: {
        showLineNumbers?: boolean;
        copy?: 'none' | 'actionbar' | 'overlay';
    } = $props();

    const code = `const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};`;
</script>

<CodeBlock.Root value="ts">
    {#if copy === 'actionbar'}
        <CodeBlock.Header>
            <CodeBlock.Actions />
        </CodeBlock.Header>
    {/if}
    <CodeBlock.Content
        value="ts"
        {code}
        lang="typescript"
        {showLineNumbers}
        copyPlacement={copy === 'overlay' ? 'overlay' : undefined}
    />
</CodeBlock.Root>
