<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import { getContext } from 'svelte';
	import { cn, type DefaultProps } from '@silk/ui/utils';
	import { ALERT_DIALOG_VARIANT_KEY, type AlertDialogVariant } from '.';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();

	const variant =
		(getContext(ALERT_DIALOG_VARIANT_KEY) as (() => AlertDialogVariant) | undefined)?.() ??
		'default';
	// Spotlight lays the two actions out as an equal, full-width split.
	const footerClass = variant === 'spotlight' ? 'grid w-full grid-cols-2 gap-2.5' : '';
</script>

<Modal.Footer class={cn(className, footerClass)} {...rest}>
	{@render children?.()}
</Modal.Footer>
