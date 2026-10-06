<script lang="ts">
    import type { Component } from 'svelte';
    import ComponentPreview from './component-preview.svelte';
    import PreviewOptions from './preview-options.svelte';

    type VariantExample = {
        value: string;
        label: string;
        component: Component;
        code: string;
        default?: boolean;
    };

    type HeroExample = {
        component: Component;
        code: string;
    };

    let {
        hero,
        variants
    }: {
        hero: HeroExample;
        variants: readonly VariantExample[];
    } = $props();

    const initial = $derived(
        variants.find((variant) => {
            return variant.default;
        }) ?? variants[0]
    );

    let selected = $state<string>();

    const active = $derived(
        variants.find((variant) => {
            return variant.value === selected;
        })
    );

    const shown = $derived(active ?? hero);

    const options = $derived(
        variants.map((variant) => {
            return {
                value: variant.value,
                label: variant.label
            };
        })
    );

    function readVariant() {
        return (active ?? initial).value;
    }

    function writeVariant(next: string) {
        selected = next;
    }
</script>

{#snippet controls()}
    <PreviewOptions label="Variant" {options} bind:value={readVariant, writeVariant} />
{/snippet}

<ComponentPreview code={shown.code} swapKey={active?.value ?? 'overview'} {controls}>
    <shown.component />
</ComponentPreview>
