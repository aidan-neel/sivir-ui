<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import PropRow from './prop-row.svelte';

    let {
        label,
        checked = $bindable()
    }: {
        label: string;
        checked: boolean;
    } = $props();

    const switchId = $props.id();
</script>

<PropRow {label} for={switchId}>
    <Switch bind:checked id={switchId} class="self-center" />
</PropRow>
