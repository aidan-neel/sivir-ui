<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    const questions = [
        {
            question: 'What is your refund policy?',
            answer: 'Every purchase has a 30-day money-back guarantee. Email support@example.com to request a refund.'
        },
        {
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 5 to 7 business days. Express takes 2 to 3 and includes tracking.'
        },
        {
            question: 'Do you offer bulk discounts?',
            answer: 'Orders over 100 units get 15% off. Contact sales for a quote on larger orders.'
        }
    ];
</script>

<div class="w-full max-w-md divide-y divide-border">
    {#each questions as item (item.question)}
        <div class="py-1">
            <Collapsible.Root>
                <Collapsible.Trigger>{item.question}</Collapsible.Trigger>
                <Collapsible.Content>{item.answer}</Collapsible.Content>
            </Collapsible.Root>
        </div>
    {/each}
</div>
