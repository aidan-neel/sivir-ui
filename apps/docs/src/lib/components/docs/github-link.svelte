<script lang="ts">
    import { Button, type ButtonVariant } from '@sivir-ui/svelte/components/button';
    import { mode } from 'mode-watcher';

    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';

    let {
        starCount = null,
        class: className = '',
        iconClass = 'size-[0.9375rem]',
        variant = 'outline'
    }: {
        starCount?: number | null;
        class?: string;
        iconClass?: string;
        variant?: ButtonVariant;
    } = $props();

    const label = $derived(formatStarCount(starCount));

    function formatStarCount(count: number | null): string {
        if (count === null || Number.isNaN(count)) {
            return 'Star';
        }

        if (count >= 1000) {
            const thousands = count / 1000;

            return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1)}k`;
        }

        return String(count);
    }
</script>

<Button
    class={`group tabular-nums ${className}`}
    {variant}
    href="https://github.com/aidan-neel/sivir-ui"
    target="_blank"
    rel="noreferrer"
    aria-label={starCount === null ? 'Star Sivir UI on GitHub' : `${label} GitHub stars`}
>
    <img src={mode.current === 'dark' ? GitHubWhite : GitHubBlack} alt="" class={iconClass} />
    <span>{label}</span>
</Button>
