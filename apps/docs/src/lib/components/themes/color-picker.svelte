<script lang="ts">
	import { ColorPicker } from '@silk/ui/components/color-picker';
	import type { ColorOption } from '@silk/ui/components/color-picker';

	type Props = {
		value: string;
		label: string;
		onValueChange?: (value: string) => void;
		swatches?: ColorOption[];
		showSelect?: boolean;
		class?: string;
	};

	let { value, label, onValueChange, swatches, showSelect, class: className }: Props = $props();
</script>

<ColorPicker {value} {label} {onValueChange} options={swatches} {showSelect} class={className} />
