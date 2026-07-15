<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import type { DefaultProps } from '@sivir/ui/utils';

	type Props = {
		allowClickOutside?: boolean;
		/** Max-width preset. Defaults to `md`. */
		size?: 'sm' | 'md' | 'lg' | 'xl';
		/** Show the top-right close (X) button. Defaults to `true`. */
		showClose?: boolean;
	} & DefaultProps;

	let {
		class: className,
		allowClickOutside = false,
		size = 'md',
		showClose = true,
		children,
		...rest
	}: Props = $props();
</script>

<Modal.Content
	{allowClickOutside}
	{size}
	{showClose}
	role="alertdialog"
	panelIdPrefix="alert-dialog"
	data-ui="alert-dialog-content"
	class={className}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
