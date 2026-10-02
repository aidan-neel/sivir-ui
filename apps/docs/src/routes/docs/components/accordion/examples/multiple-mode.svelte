<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';
</script>

<div class="w-full max-w-md">
    <Accordion.Root type="multiple">
        <Accordion.Item value="delivery">
            <Accordion.Trigger>Delivery</Accordion.Trigger>
            <Accordion.Content>Arrives Thursday, March 6, by 8 pm.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="payment">
            <Accordion.Trigger>Payment</Accordion.Trigger>
            <Accordion.Content>Visa ending in 4242, charged $144.00.</Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>
