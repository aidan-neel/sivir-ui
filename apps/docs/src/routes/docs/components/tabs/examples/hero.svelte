<script lang="ts">
    import type { TabsVariant } from '@sivir-ui/svelte/components/tabs';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { type TabsOrientation, tabsListClass } from '../playground/playground';

    let {
        variant = 'default',
        orientation = 'horizontal',
        disabledTab = false
    }: {
        variant?: TabsVariant;
        orientation?: TabsOrientation;
        disabledTab?: boolean;
    } = $props();

    let activeTab = $state('overview');
</script>

<div class="flex justify-center p-3 sm:p-6">
    <div class="w-full max-w-sm">
        <Tabs.Root bind:value={activeTab} {orientation} {variant}>
            <Tabs.List class={tabsListClass[orientation]}>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                <Tabs.Trigger value="files" disabled={disabledTab}>Files</Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    </div>
</div>
