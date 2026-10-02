<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
</script>

<article class="flex w-full max-w-xl flex-col gap-2">
    <Typography.Metadata>Release 0.2.9 / September 3, 2026</Typography.Metadata>
    <Typography.Title level={2}>Builds now reuse cached dependencies</Typography.Title>
    <Typography.Description class="max-w-[62ch]">
        Unchanged packages are restored from cache, so most builds skip the install step. Clear the
        cache from project settings.
    </Typography.Description>
</article>
