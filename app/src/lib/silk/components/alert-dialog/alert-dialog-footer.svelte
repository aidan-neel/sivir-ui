<script lang="ts">
	import * as Modal from '$lib/silk/components/modal';
	import type { DefaultProps } from '$lib/silk/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();
</script>

<Modal.Footer class={className} {...rest}>
	{@render children?.()}
</Modal.Footer>
