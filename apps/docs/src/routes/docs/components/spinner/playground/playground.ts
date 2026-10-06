export type SpinnerSize = '12' | '16' | '20' | '24';

export type SpinnerSpeed = '0.5' | '1' | '2';

export type SpinnerSettings = {
    size: SpinnerSize;
    speed: SpinnerSpeed;
    curved: boolean;
    ready: boolean;
};

export const spinnerDefaults: SpinnerSettings = {
    size: '16',
    speed: '1',
    curved: false,
    ready: false
};

export function spinnerStatus(ready: boolean) {
    return ready ? 'Up to date' : 'Checking for updates';
}

function spinnerProps(settings: SpinnerSettings) {
    const props: string[] = [];

    if (settings.size !== spinnerDefaults.size) {
        props.push(`size={${settings.size}}`);
    }
    if (settings.speed !== spinnerDefaults.speed) {
        props.push(`speed={${settings.speed}}`);
    }
    if (settings.curved) {
        props.push('curved');
    }
    if (settings.ready) {
        props.push('ready');
    }
    props.push('aria-hidden="true"');
    return props;
}

export function spinnerCode(settings: SpinnerSettings) {
    return `<script lang="ts">
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
</script>

<div class="flex items-center gap-3 text-sm text-foreground-muted">
    <Spinner ${spinnerProps(settings).join(' ')} />
    <span>${spinnerStatus(settings.ready)}</span>
</div>
`;
}

export function changedSpinnerProps(settings: SpinnerSettings) {
    const keys = Object.keys(spinnerDefaults) as (keyof SpinnerSettings)[];

    return keys.filter((key) => {
        return settings[key] !== spinnerDefaults[key];
    }).length;
}
