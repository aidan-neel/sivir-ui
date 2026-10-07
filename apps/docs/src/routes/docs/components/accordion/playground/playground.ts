export type AccordionType = 'single' | 'multiple';

export type AccordionSettings = {
    type: AccordionType;
    collapsible: boolean;
    disabled: boolean;
};

export const accordionDefaults: AccordionSettings = {
    type: 'single',
    collapsible: true,
    disabled: false
};

function rootProps(settings: AccordionSettings) {
    if (settings.type === 'multiple') {
        return `type="multiple" value={['item-1']}`;
    }
    if (!settings.collapsible) {
        return 'type="single" value="item-1" collapsible={false}';
    }
    return 'type="single" value="item-1"';
}

function itemProps(settings: AccordionSettings) {
    if (settings.disabled) {
        return 'value="item-3" disabled';
    }
    return 'value="item-3"';
}

export function accordionCode(settings: AccordionSettings) {
    return `<script lang="ts">
    import * as Accordion from '@sivir-ui/svelte/components/accordion';
</script>

<Accordion.Root ${rootProps(settings)}>
    <Accordion.Item value="item-1">
        <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        <Accordion.Content>
            Yes. Each trigger is a button with aria-expanded and aria-controls, and each panel
            is a region labelled by its trigger.
        </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
        <Accordion.Trigger>Does it animate?</Accordion.Trigger>
        <Accordion.Content>
            Yes. Panels slide open and closed over the theme's panel motion duration.
        </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item ${itemProps(settings)}>
        <Accordion.Trigger>Does it theme?</Accordion.Trigger>
        <Accordion.Content>
            Yes. Colors, type, borders, and timing come from theme tokens.
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>
`;
}

export function changedAccordionProps(settings: AccordionSettings) {
    const changes = [
        settings.type !== accordionDefaults.type,
        settings.type === 'single' && settings.collapsible !== accordionDefaults.collapsible,
        settings.disabled !== accordionDefaults.disabled
    ];

    return changes.filter(Boolean).length;
}
