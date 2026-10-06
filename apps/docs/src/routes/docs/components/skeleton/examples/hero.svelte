<script lang="ts">
    import { SkeletonSwap } from '@sivir-ui/svelte/components/skeleton';
    import { onMount } from 'svelte';
    import { profileBio } from '../playground/playground';

    let {
        lines = 3,
        barHeight = 9,
        delay = 120
    }: {
        lines?: number;
        barHeight?: number;
        delay?: number;
    } = $props();

    let ready = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    onMount(() => {
        timer = setTimeout(() => (ready = true), 850);
        return () => clearTimeout(timer);
    });
</script>

<div class="w-full max-w-sm">
    <SkeletonSwap {ready} {lines} lineHeight={21} {barHeight} {delay} label="Profile">
        {#if ready}
            <p class="text-sm leading-[21px] text-foreground-muted">
                {profileBio}
            </p>
        {/if}
    </SkeletonSwap>
</div>
