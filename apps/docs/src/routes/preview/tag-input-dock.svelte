<script lang="ts">
    import type { TagInputVariant } from '@sivir-ui/svelte/components/tag-input';
    import ConceptSelect from './concept-select.svelte';
    import Dock from './dock.svelte';
    import type { ConceptOption } from './options';
    import PropGroup from './prop-group.svelte';
    import PropRow from './prop-row.svelte';
    import PropSwitch from './prop-switch.svelte';
    import Segmented from './segmented.svelte';
    import TagInputDemo from './tag-input-demo.svelte';
    import {
        changedTagInputProps,
        type TagInputDelimiters,
        type TagInputExample,
        type TagInputMax,
        type TagInputSettings,
        tagInputCode,
        tagInputContent,
        tagInputDefaults
    } from './tag-input-playground';

    const exampleOptions: ConceptOption<TagInputExample>[] = [
        {
            value: 'topics',
            label: 'Topics'
        },
        {
            value: 'emails',
            label: 'Emails'
        },
        {
            value: 'channels',
            label: 'Channels'
        }
    ];
    const variantOptions: ConceptOption<TagInputVariant>[] = [
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        }
    ];
    const maxOptions: ConceptOption<TagInputMax>[] = [
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
    const delimiterOptions: ConceptOption<TagInputDelimiters>[] = [
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

<Dock {morphKey} {code} {changed} stageClass="min-h-[22rem]">
    {#snippet examples()}
        <span class="hidden sm:contents">
            <Segmented label="Example" options={exampleOptions} bind:value={settings.example} />
        </span>
        <span class="contents sm:hidden">
            <ConceptSelect
                label="Example"
                variant="ghost"
                options={exampleOptions}
                bind:value={settings.example}
                class="shrink-0"
            />
        </span>
    {/snippet}
    {#snippet controls()}
        <ConceptSelect
            label="Variant"
            variant="ghost"
            options={variantOptions}
            bind:value={settings.variant}
            class="shrink-0"
        />
    {/snippet}
    {#snippet props()}
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
                <Segmented label="Max" size="sm" options={maxOptions} bind:value={settings.max} />
            </PropRow>
            <PropRow label="Delimiters">
                <Segmented
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
    <TagInputDemo {settings} bind:tags={tagsByExample[settings.example]} />
</Dock>
