<script lang="ts">
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';

    let {
        streaming = false,
        summary,
        orb = false
    }: {
        streaming?: boolean;
        summary?: string;
        orb?: boolean;
    } = $props();
</script>

<Reasoning.Root {streaming} duration={streaming ? undefined : 6} open class="w-full max-w-xl">
    <Reasoning.Trigger status="Matching the first failing request" {summary}>
        {#snippet icon(state)}
            {#if orb}
                <Reasoning.Orb active={state.streaming} />
            {/if}
        {/snippet}
    </Reasoning.Trigger>
    <Reasoning.Content>
        <Reasoning.Steps>
            <Reasoning.Step title="Compared the incident with recent deployments">
                The errors start two minutes after the last production deploy.
            </Reasoning.Step>
            <Reasoning.Step title="Filtered payment errors by issuer country">
                Only non-US cards fail, so the regression sits in address verification.
            </Reasoning.Step>
            <Reasoning.Step
                title="Matching the first failing request"
                status={streaming ? 'active' : 'complete'}
            >
                The first failure lines up with the provider’s new verification rule.
            </Reasoning.Step>
        </Reasoning.Steps>
    </Reasoning.Content>
</Reasoning.Root>
