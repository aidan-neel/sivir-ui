<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import type { DefaultProps } from '@silk/ui/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();
</script>

<Modal.Footer class={className} {...rest}>
	{@render children?.()}
</Modal.Footer>
