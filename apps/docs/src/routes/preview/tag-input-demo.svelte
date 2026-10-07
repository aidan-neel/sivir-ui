<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';
    import {
        isEmail,
        type TagInputSettings,
        tagInputContent,
        tagInputDelimiters,
        tagInputMax
    } from './tag-input-playground';

    let {
        settings,
        tags = $bindable()
    }: {
        settings: TagInputSettings;
        tags: string[];
    } = $props();

    const content = $derived(tagInputContent[settings.example]);
</script>

<div class="w-[min(28rem,calc(100vw-5rem))]">
    <TagInput.Root
        bind:tags
        variant={settings.variant}
        label={settings.label ? content.label : undefined}
        description={settings.description ? content.description : undefined}
        error={settings.error ? content.error : undefined}
        max={tagInputMax(settings.max)}
        delimiters={tagInputDelimiters(settings.delimiters)}
        validate={content.email ? isEmail : undefined}
        normalize={content.email
            ? (tag) => {
                  return tag.toLowerCase();
              }
            : undefined}
        allowDuplicates={settings.allowDuplicates}
        addOnBlur={settings.addOnBlur}
        addOnPaste={settings.addOnPaste}
        required={settings.required}
        disabled={settings.disabled}
    >
        <TagInput.List />
        <TagInput.Input
            placeholder={content.placeholder}
            aria-label={settings.label ? undefined : content.label}
        />
    </TagInput.Root>
</div>
