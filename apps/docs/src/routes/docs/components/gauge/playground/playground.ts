import type { GaugeSize, GaugeTone } from '@sivir-ui/svelte/components/gauge';

export type GaugeValueOption = '24' | '58' | '85' | '100';

export type GaugeSettings = {
    value: GaugeValueOption;
    tone: GaugeTone;
    size: GaugeSize;
};

export const gaugeDefaults: GaugeSettings = {
    value: '58',
    tone: 'primary',
    size: 'md'
};

function rootProps(settings: GaugeSettings) {
    const props = [`value={${settings.value}}`, 'label="Context used"'];

    if (settings.tone !== 'primary') {
        props.push(`tone="${settings.tone}"`);
    }

    if (settings.size !== 'md') {
        props.push(`size="${settings.size}"`);
    }

    return props.join(' ');
}

export function gaugeCode(settings: GaugeSettings) {
    return `<script lang="ts">
    import * as Gauge from '@sivir-ui/svelte/components/gauge';
</script>

<Gauge.Root ${rootProps(settings)} />
`;
}

export function changedGaugeProps(settings: GaugeSettings) {
    const keys = Object.keys(gaugeDefaults) as (keyof GaugeSettings)[];

    return keys.filter((key) => {
        return settings[key] !== gaugeDefaults[key];
    }).length;
}
