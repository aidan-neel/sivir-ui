<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';
</script>

<div class="w-full max-w-md">
    <Accordion.Root type="single">
        <Accordion.Item value="plan">
            <Accordion.Trigger>Can I change my plan later?</Accordion.Trigger>
            <Accordion.Content
                >Yes. Plan changes take effect on your next billing date.</Accordion.Content
            >
        </Accordion.Item>
        <Accordion.Item value="refunds">
            <Accordion.Trigger>Do you offer refunds?</Accordion.Trigger>
            <Accordion.Content
                >Annual plans can be refunded within 14 days of purchase.</Accordion.Content
            >
        </Accordion.Item>
    </Accordion.Root>
</div>
