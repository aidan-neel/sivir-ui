import type { TabsVariant } from '@sivir-ui/svelte/components/tabs';

export type TabsOrientation = 'horizontal' | 'vertical';

export type TabsSettings = {
    variant: TabsVariant;
    orientation: TabsOrientation;
    disabledTab: boolean;
};

export const tabsDefaults: TabsSettings = {
    variant: 'default',
    orientation: 'horizontal',
    disabledTab: false
};

export const tabsListClass: Record<TabsOrientation, string> = {
    horizontal: 'grid w-full grid-cols-3',
    vertical: 'min-w-28'
};

function rootProps(settings: TabsSettings) {
    const props = ['bind:value={activeTab}'];

    if (settings.orientation !== tabsDefaults.orientation) {
        props.push(`orientation="${settings.orientation}"`);
    }
    if (settings.variant !== tabsDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    return props;
}

function filesTrigger(settings: TabsSettings) {
    if (settings.disabledTab) {
        return '<Tabs.Trigger value="files" disabled>Files</Tabs.Trigger>';
    }
    return '<Tabs.Trigger value="files">Files</Tabs.Trigger>';
}

export function tabsCode(settings: TabsSettings) {
    return `<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';

    let activeTab = $state('overview');
</script>

<div class="flex justify-center p-3 sm:p-6">
    <div class="w-full max-w-sm">
        <Tabs.Root ${rootProps(settings).join(' ')}>
            <Tabs.List class="${tabsListClass[settings.orientation]}">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                ${filesTrigger(settings)}
            </Tabs.List>
        </Tabs.Root>
    </div>
</div>
`;
}

export function changedTabsProps(settings: TabsSettings) {
    const keys = Object.keys(tabsDefaults) as (keyof TabsSettings)[];

    return keys.filter((key) => {
        return key !== 'variant' && settings[key] !== tabsDefaults[key];
    }).length;
}
