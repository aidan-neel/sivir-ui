<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();
</script>

<Modal.Footer class={cn(className, 'justify-between flex mt-1')} {...rest}>
	{@render children?.()}
</Modal.Footer>
