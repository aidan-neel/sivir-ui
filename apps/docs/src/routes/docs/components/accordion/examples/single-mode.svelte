<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';

    let selected = $state('shipping');
</script>

<div class="w-full max-w-md">
    <Accordion.Root type="single" bind:value={selected} collapsible={false}>
        <Accordion.Item value="shipping">
            <Accordion.Trigger>Shipping</Accordion.Trigger>
            <Accordion.Content
                >Most orders ship within 1 business day. Standard delivery takes 5-7 days.</Accordion.Content
            >
        </Accordion.Item>
        <Accordion.Item value="returns">
            <Accordion.Trigger>Returns</Accordion.Trigger>
            <Accordion.Content
                >Return items within 30 days in original condition for a full refund.</Accordion.Content
            >
        </Accordion.Item>
    </Accordion.Root>
</div>
