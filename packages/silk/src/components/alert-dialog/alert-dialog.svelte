<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import type { AlertDialogProps } from '.';

	let { open = $bindable(false), children }: AlertDialogProps = $props();
</script>

<Modal.Root bind:open>
	{@render children?.()}
</Modal.Root>
