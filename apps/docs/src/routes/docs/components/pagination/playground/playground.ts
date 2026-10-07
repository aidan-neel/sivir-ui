export type PaginationTotal = '5' | '10' | '20' | '50';

export type PaginationSiblings = '0' | '1' | '2';

export type PaginationSettings = {
    total: PaginationTotal;
    siblings: PaginationSiblings;
};

export const paginationDefaults: PaginationSettings = {
    total: '20',
    siblings: '2'
};

export const PAGINATION_START_PAGE = 8;

const LIBRARY_SIBLINGS = '1';

export function paginationCode(settings: PaginationSettings, page: number) {
    const props = ['bind:page', `total={${settings.total}}`];

    if (settings.siblings !== LIBRARY_SIBLINGS) {
        props.push(`siblings={${settings.siblings}}`);
    }

    return `<script lang="ts">
    import { Pagination } from '@sivir-ui/svelte/components/pagination';

    let page = $state(${page});
</script>

<Pagination ${props.join(' ')} />
`;
}

export function changedPaginationProps(settings: PaginationSettings) {
    const keys = Object.keys(paginationDefaults) as (keyof PaginationSettings)[];

    return keys.filter((key) => {
        return settings[key] !== paginationDefaults[key];
    }).length;
}
