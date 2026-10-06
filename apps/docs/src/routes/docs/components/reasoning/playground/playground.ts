export type ReasoningSettings = {
    streaming: boolean;
    title: boolean;
};

export const reasoningDefaults: ReasoningSettings = {
    streaming: false,
    title: false
};

export const reasoningTitle = 'Traced the payment errors to a new verification rule';

export function reasoningCode(settings: ReasoningSettings) {
    const rootProps: string[] = [];
    const triggerProps = ['duration="4.8s"'];

    if (settings.streaming) {
        rootProps.push('streaming');
    }
    rootProps.push('class="w-full max-w-xl"');

    if (settings.title) {
        triggerProps.push(`title="${reasoningTitle}"`);
    }

    return `<script lang="ts">
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
</script>

<Reasoning.Root ${rootProps.join(' ')}>
    <Reasoning.Trigger ${triggerProps.join(' ')} />
    <Reasoning.Content>
        <div class="space-y-3">
            <p>Compared the incident timeline with the last five production deployments.</p>
            <p>
                Filtered payment errors by issuer country and found the regression only affects
                non-US cards.
            </p>
            <p>
                Matched the first failing request to the new address-verification rule shipped by
                the provider.
            </p>
        </div>
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
