<script lang="ts">
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import {
        type PlaygroundExample,
        type PlaygroundSize,
        playgroundCode
    } from '../docs/components/button/playground/playground';
    import Playground from '../docs/components/button/playground/playground.svelte';
    import ConceptSelect from './concept-select.svelte';
    import Dock from './dock.svelte';
    import { exampleOptions, sizeOptions, variantOptions } from './options';
    import Segmented from './segmented.svelte';

    let example = $state<PlaygroundExample>('default');
    let variant = $state<ButtonVariant>('primary');
    let size = $state<PlaygroundSize>('md');

    const code = $derived(
        playgroundCode({
            example,
            variant,
            size
        })
    );
</script>

<Dock morphKey={`${example}-${variant}-${size}`} {code}>
    {#snippet examples()}
        <span class="hidden sm:contents">
            <Segmented label="Example" options={exampleOptions} bind:value={example} />
        </span>
        <span class="contents sm:hidden">
            <ConceptSelect
                label="Example"
                variant="ghost"
                options={exampleOptions}
                bind:value={example}
                class="shrink-0"
            />
        </span>
    {/snippet}
    {#snippet controls()}
        <ConceptSelect
            label="Variant"
            variant="ghost"
            options={variantOptions}
            bind:value={variant}
            class="shrink-0"
        />
        <ConceptSelect
            label="Size"
            variant="ghost"
            options={sizeOptions}
            bind:value={size}
            class="shrink-0"
        />
    {/snippet}
    <Playground {example} {variant} {size} />
</Dock>
