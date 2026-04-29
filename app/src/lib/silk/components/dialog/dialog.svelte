<script lang="ts">
	import * as Modal from '$lib/silk/components/modal';
	import type { DialogProps } from '.';

	let { open = $bindable(false), children }: DialogProps = $props();
</script>

<Modal.Root bind:open>
	{@render children?.()}
</Modal.Root>
