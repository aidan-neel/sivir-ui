<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';

    let tab = $state('account');
</script>

<div class="w-full max-w-lg p-2 sm:p-4">
    <Tabs.Root bind:value={tab} orientation="vertical" variant="ghost">
        <Tabs.List class="min-w-28">
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
            <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
        </Tabs.List>
    </Tabs.Root>
</div>
