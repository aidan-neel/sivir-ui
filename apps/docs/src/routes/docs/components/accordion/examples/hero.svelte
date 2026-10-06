<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';

    let {
        type = 'single',
        collapsible = true,
        disabled = false
    }: {
        type?: 'single' | 'multiple';
        collapsible?: boolean;
        disabled?: boolean;
    } = $props();

    const value = $derived(type === 'multiple' ? ['item-1'] : 'item-1');
</script>

<div class="w-full max-w-md">
    <Accordion.Root {type} {value} {collapsible}>
        <Accordion.Item value="item-1">
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
            <Accordion.Content>
                Yes. Each trigger is a button with aria-expanded and aria-controls, and each panel
                is a region labelled by its trigger.
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
            <Accordion.Trigger>Does it animate?</Accordion.Trigger>
            <Accordion.Content>
                Yes. Panels slide open and closed over the theme's panel motion duration.
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3" {disabled}>
            <Accordion.Trigger>Does it theme?</Accordion.Trigger>
            <Accordion.Content>
                Yes. Colors, type, borders, and timing come from theme tokens.
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>
