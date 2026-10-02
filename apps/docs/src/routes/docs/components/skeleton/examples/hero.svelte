<script lang="ts">
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
    <SkeletonSwap {ready} lines={3} lineHeight={21} label="Profile">
        {#if ready}
            <p class="text-sm leading-[21px] text-foreground-muted">
                Product designer in Lisbon. Works on onboarding and billing. Previously led the
                design system at a travel startup.
            </p>
        {/if}
    </SkeletonSwap>
</div>
