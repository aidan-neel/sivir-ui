<script lang="ts">
    import type { TagInputVariant } from '@sivir-ui/svelte/components/tag-input';
    import {
        ComponentPreview,
        PreviewExamples,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSwitch
    } from '$lib/components/docs';
    import {
        changedTagInputProps,
        type TagInputDelimiters,
        type TagInputMax,
        type TagInputSettings,
        tagInputCode,
        tagInputContent,
        tagInputDefaults
    } from './playground';
    import Playground from './playground.svelte';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const variantOptions: Option<TagInputVariant>[] = [
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        }
    ];
    const maxOptions: Option<TagInputMax>[] = [
        {
            value: 'none',
            label: 'None'
        },
        {
            value: '3',
            label: '3'
        },
        {
            value: '5',
            label: '5'
        }
    ];
    const delimiterOptions: Option<TagInputDelimiters>[] = [
        {
            value: 'comma',
            label: 'Comma'
        },
        {
            value: 'space',
            label: 'Space'
        },
        {
            value: 'enter',
            label: 'Enter'
        }
    ];

    let settings = $state<TagInputSettings>({
        example: 'topics',
        ...tagInputDefaults
    });
    let tagsByExample = $state({
        topics: [...tagInputContent.topics.tags],
        emails: [...tagInputContent.emails.tags],
        channels: [...tagInputContent.channels.tags]
    });

    const code = $derived(tagInputCode(settings));
    const changed = $derived(changedTagInputProps(settings));
    const morphKey = $derived(
        [
            settings.example,
            settings.variant,
            settings.label,
            settings.description,
            settings.error,
            settings.disabled
        ].join('-')
    );
</script>

{#snippet variantControl()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet propsPanel()}
    <PropGroup title="Content">
        <PropSwitch label="Label" bind:checked={settings.label} />
        <PropSwitch label="Description" bind:checked={settings.description} />
        <PropSwitch label="Error" bind:checked={settings.error} />
    </PropGroup>
    <PropGroup title="State">
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
        <PropSwitch label="Required" bind:checked={settings.required} />
    </PropGroup>
    <PropGroup title="Behavior">
        <PropRow label="Max">
            <PreviewExamples label="Max" size="sm" options={maxOptions} bind:value={settings.max} />
        </PropRow>
        <PropRow label="Delimiters">
            <PreviewExamples
                label="Delimiters"
                size="sm"
                options={delimiterOptions}
                bind:value={settings.delimiters}
            />
        </PropRow>
        <PropSwitch label="Allow duplicates" bind:checked={settings.allowDuplicates} />
        <PropSwitch label="Add on blur" bind:checked={settings.addOnBlur} />
        <PropSwitch label="Add on paste" bind:checked={settings.addOnPaste} />
    </PropGroup>
{/snippet}

<ComponentPreview
    {code}
    {changed}
    controls={variantControl}
    props={propsPanel}
    swapKey="playground"
>
    <PreviewMorph key={morphKey}>
        <Playground {settings} bind:tags={tagsByExample[settings.example]} />
    </PreviewMorph>
</ComponentPreview>
