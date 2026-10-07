export type SkeletonLines = '2' | '3' | '4';

export type SkeletonBarHeight = '6' | '9' | '12';

export type SkeletonDelay = '0' | '120' | '1000';

export type SkeletonSettings = {
    lines: SkeletonLines;
    barHeight: SkeletonBarHeight;
    delay: SkeletonDelay;
};

export const skeletonDefaults: SkeletonSettings = {
    lines: '3',
    barHeight: '9',
    delay: '120'
};

export const profileBio =
    'Product designer in Lisbon. Works on onboarding and billing. Previously led the design system at a travel startup.';

function skeletonProps(settings: SkeletonSettings) {
    const props = ['{ready}', `lines={${settings.lines}}`, 'lineHeight={21}'];

    if (settings.barHeight !== skeletonDefaults.barHeight) {
        props.push(`barHeight={${settings.barHeight}}`);
    }
    if (settings.delay !== skeletonDefaults.delay) {
        props.push(`delay={${settings.delay}}`);
    }
    props.push('label="Profile"');
    return props;
}

function skeletonOpenTag(settings: SkeletonSettings) {
    const props = skeletonProps(settings);

    if (props.length <= 4) {
        return `    <SkeletonSwap ${props.join(' ')}>`;
    }

    const lines = props.map((prop) => {
        return `        ${prop}`;
    });

    return `    <SkeletonSwap\n${lines.join('\n')}\n    >`;
}

export function skeletonCode(settings: SkeletonSettings) {
    return `<script lang="ts">
    import { SkeletonSwap } from '@sivir-ui/svelte/components/skeleton';
    import { onMount } from 'svelte';

    let ready = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    onMount(() => {
        timer = setTimeout(() => (ready = true), 850);
        return () => clearTimeout(timer);
    });
</script>

<div class="w-full max-w-sm">
${skeletonOpenTag(settings)}
        {#if ready}
            <p class="text-sm leading-[21px] text-foreground-muted">
                ${profileBio}
            </p>
        {/if}
    </SkeletonSwap>
</div>
`;
}

export function changedSkeletonProps(settings: SkeletonSettings) {
    const keys = Object.keys(skeletonDefaults) as (keyof SkeletonSettings)[];

    return keys.filter((key) => {
        return settings[key] !== skeletonDefaults[key];
    }).length;
}
