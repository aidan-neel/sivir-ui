<script lang="ts">
    import AlignCenter from '@lucide/svelte/icons/align-center';
    import AlignLeft from '@lucide/svelte/icons/align-left';
    import AlignRight from '@lucide/svelte/icons/align-right';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import type { ToggleGroupSettings } from '../playground/playground';

    let {
        type,
        disabled,
        value = $bindable()
    }: ToggleGroupSettings & {
        value: string | string[] | undefined;
    } = $props();
</script>

<ToggleGroup.Root {type} {disabled} bind:value>
    <ToggleGroup.Item value="left" aria-label="Align left">
        <AlignLeft size={14} />
    </ToggleGroup.Item>
    <ToggleGroup.Item value="center" aria-label="Align center">
        <AlignCenter size={14} />
    </ToggleGroup.Item>
    <ToggleGroup.Item value="right" aria-label="Align right">
        <AlignRight size={14} />
    </ToggleGroup.Item>
</ToggleGroup.Root>
