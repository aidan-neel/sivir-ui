<script lang="ts">
	import * as Modal from '$lib/silk/components/modal';
	import type { DialogFooterProps } from '.';

	let { class: className, children, ...rest }: DialogFooterProps = $props();
</script>

<Modal.Footer class={className} {...rest}>
	{@render children?.()}
</Modal.Footer>
