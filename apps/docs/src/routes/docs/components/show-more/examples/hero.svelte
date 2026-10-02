<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';

    const paragraphs = [
        'On March 4, checkout requests in the EU region failed for 23 minutes after a configuration change lowered the connection pool limit on the payments database from 200 to 20.',
        'Client retries tripled traffic to the API during the outage, which slowed recovery after the limit was restored. About 1,800 orders failed, and none of those customers were charged.',
        'We now validate pool limits in CI, cap client retries at three with backoff, and page the on-call engineer when the checkout error rate stays above 2% for five minutes.'
    ];
</script>

<div class="w-full max-w-md">
    <ShowMore lines={2} label="Incident summary">
        <div class="flex flex-col gap-2">
            {#each paragraphs as paragraph (paragraph)}
                <p>{paragraph}</p>
            {/each}
        </div>
    </ShowMore>
</div>
