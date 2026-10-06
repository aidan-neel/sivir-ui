<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';

    let notifications = $state(true);
</script>

<Toggle bind:pressed={notifications} aria-label="Notifications">
    <Bell size={14} />
</Toggle>
