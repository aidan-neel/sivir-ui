<script lang="ts">
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';

    let {
        variant = 'ghost',
        size = 'icon',
        disabled = false
    }: {
        variant?: 'ghost' | 'outline' | 'secondary';
        size?: 'icon' | 'sm' | 'md' | 'lg';
        disabled?: boolean;
    } = $props();
</script>

{#if size === 'icon'}
    <CopyButton text="bun add @sivir-ui/svelte" {variant} {disabled} />
{:else}
    <CopyButton text="bun add @sivir-ui/svelte" {variant} {size} {disabled}>Copy</CopyButton>
{/if}
