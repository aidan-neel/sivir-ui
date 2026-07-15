<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import type { ButtonProps } from '@sivir/ui/components/button';

	let { class: className, children, onclick, ...rest }: ButtonProps = $props();
</script>

<Modal.Trigger {onclick} class={className} {...rest}>
	{@render children?.()}
</Modal.Trigger>
