<script lang="ts">
    import { Pagination } from '@sivir-ui/svelte/components/pagination';
    import type { PaginationSettings } from './playground';

    let {
        settings,
        page = $bindable()
    }: {
        settings: PaginationSettings;
        page: number;
    } = $props();
</script>

<div class="flex justify-center p-6">
    <Pagination bind:page total={Number(settings.total)} siblings={Number(settings.siblings)} />
</div>
