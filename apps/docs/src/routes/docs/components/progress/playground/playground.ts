export type ProgressValue = '0' | '35' | '65' | '100';

export type ProgressSettings = {
    value: ProgressValue;
    indeterminate: boolean;
};

export const progressDefaults: ProgressSettings = {
    value: '65',
    indeterminate: false
};

export function progressCode(settings: ProgressSettings) {
    const props: string[] = [];

    if (settings.indeterminate) {
        props.push('indeterminate');
    } else {
        props.push(`value={${settings.value}}`);
    }

    return `<script lang="ts">
    import { Progress } from '@sivir-ui/svelte/components/progress';
</script>

<Progress ${props.join(' ')} class="w-full max-w-md" />
`;
}

export function changedProgressProps(settings: ProgressSettings) {
    const keys = Object.keys(progressDefaults) as (keyof ProgressSettings)[];

    return keys.filter((key) => {
        return settings[key] !== progressDefaults[key];
    }).length;
}
