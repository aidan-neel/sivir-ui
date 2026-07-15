<script lang="ts">
	import { Pagination } from '@sivir/ui/components/pagination';

	let page = $state(4);
</script>

<Pagination bind:page total={20} />
