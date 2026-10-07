<script lang="ts">
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { cn } from '@sivir-ui/svelte/utils';

    let {
        code,
        class: classProp
    }: {
        code: string;
        class?: string;
    } = $props();
</script>

<div
    class={cn(
        classProp,
        'relative min-w-0 [--code-block-line-height:1.7] [--code-block-max-height:none] [--code-block-padding-x:1.1rem] [--code-block-padding-y:0.9rem]'
    )}
>
    <CopyButton
        text={code}
        label="Copy code"
        class="absolute top-2 right-2 z-10 bg-card text-foreground-muted"
    />
    <div class="max-h-[22rem] overflow-auto">
        <CodeBlock.Content {code} lang="svelte" class="rounded-none bg-transparent" />
    </div>
</div>
