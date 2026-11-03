<script lang="ts">
    import type { Snippet } from 'svelte';
    import { type ComponentSlug, componentAnatomy } from '#lib/component-anatomy.js';
    import { Anatomy } from '#lib/components/docs/index.js';
    import { page } from '$app/state';

    let { children }: { children: Snippet } = $props();
    const slug = $derived(page.url.pathname.split('/').at(-1) as ComponentSlug);
    const anatomy = $derived(componentAnatomy[slug]);
</script>

{@render children?.()}

{#if anatomy}
    <Anatomy items={anatomy} />
{/if}
