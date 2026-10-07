export type ReasoningSettings = {
    streaming: boolean;
    summary: boolean;
    orb: boolean;
};

export const reasoningDefaults: ReasoningSettings = {
    streaming: false,
    summary: false,
    orb: false
};

export const reasoningSummary = 'Traced the payment errors to a new verification rule';

export function reasoningCode(settings: ReasoningSettings) {
    const rootProps: string[] = [];
    const triggerProps = ['status="Matching the first failing request"'];
    const activeStatus = settings.streaming ? ' status="active"' : '';

    if (settings.streaming) {
        rootProps.push('streaming');
    } else {
        rootProps.push('duration={6}');
    }
    rootProps.push('open');
    rootProps.push('class="w-full max-w-xl"');

    if (settings.summary) {
        triggerProps.push(`summary="${reasoningSummary}"`);
    }

    const trigger = settings.orb
        ? `<Reasoning.Trigger ${triggerProps.join(' ')}>
        {#snippet icon({ streaming })}
            <Reasoning.Orb active={streaming} />
        {/snippet}
    </Reasoning.Trigger>`
        : `<Reasoning.Trigger ${triggerProps.join(' ')} />`;

    return `<script lang="ts">
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
</script>

<Reasoning.Root ${rootProps.join(' ')}>
    ${trigger}
    <Reasoning.Content>
        <Reasoning.Steps>
            <Reasoning.Step title="Compared the incident with recent deployments">
                The errors start two minutes after the last production deploy.
            </Reasoning.Step>
            <Reasoning.Step title="Filtered payment errors by issuer country">
                Only non-US cards fail, so the regression sits in address verification.
            </Reasoning.Step>
            <Reasoning.Step title="Matching the first failing request"${activeStatus}>
                The first failure lines up with the provider’s new verification rule.
            </Reasoning.Step>
        </Reasoning.Steps>
    </Reasoning.Content>
</Reasoning.Root>
`;
}

export function changedReasoningProps(settings: ReasoningSettings) {
    const keys = Object.keys(reasoningDefaults) as (keyof ReasoningSettings)[];

    return keys.filter((key) => {
        return settings[key] !== reasoningDefaults[key];
    }).length;
}
