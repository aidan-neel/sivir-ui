<script lang="ts">
    import Bold from '@lucide/svelte/icons/bold';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
    import { type ToggleSettings, toggleIconSize } from '../playground/playground';

    let { variant, size, disabled, pressed = $bindable() }: ToggleSettings = $props();
</script>

<Toggle bind:pressed {variant} {size} {disabled} aria-label="Bold">
    <Bold size={toggleIconSize(size)} />
</Toggle>
