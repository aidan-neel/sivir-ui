export type SliderStep = '1' | '5' | '10';

export type SliderSettings = {
    step: SliderStep;
    disabled: boolean;
};

export const sliderDefaults: SliderSettings = {
    step: '1',
    disabled: false
};

const MAX_LINE = 100;

function sliderTag(props: string[]) {
    const inline = `    <Slider ${props.join(' ')} />`;

    if (inline.length <= MAX_LINE) {
        return inline;
    }

    const lines = props.map((prop) => {
        return `        ${prop}`;
    });

    return `    <Slider\n${lines.join('\n')}\n    />`;
}

function percentProps(settings: SliderSettings, binding: string, label: string) {
    const props = [`bind:value={${binding}}`];

    if (settings.step !== sliderDefaults.step) {
        props.push(`step={${settings.step}}`);
    }
    props.push(`label="${label}"`);
    props.push('format={formatPercent}');
    return props;
}

function sliderTags(settings: SliderSettings) {
    const quality = ['bind:value={quality}', 'min={1}', 'max={4}', 'label="Quality"'];
    const strength = percentProps(settings, 'strength', 'Strength');
    const opacity = percentProps(settings, 'opacity', 'Opacity');

    quality.push('format={formatQuality}');
    strength.push('editable');

    const sliders = [quality, strength, opacity];

    return sliders.map((props) => {
        if (settings.disabled) {
            props.push('disabled');
        }
        return sliderTag(props);
    });
}

export function sliderCode(settings: SliderSettings) {
    return `<script lang="ts">
    import { Slider } from '@sivir-ui/svelte/components/slider';

    let quality = $state(2);
    let strength = $state(100);
    let opacity = $state(72);

    function formatQuality(value: number) {
        return \`\${value}k\`;
    }

    function formatPercent(value: number) {
        return \`\${value}%\`;
    }
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
${sliderTags(settings).join('\n')}
</div>
`;
}

export function changedSliderProps(settings: SliderSettings) {
    const keys = Object.keys(sliderDefaults) as (keyof SliderSettings)[];

    return keys.filter((key) => {
        return settings[key] !== sliderDefaults[key];
    }).length;
}
