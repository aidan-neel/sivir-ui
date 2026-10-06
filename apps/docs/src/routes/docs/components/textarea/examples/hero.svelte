<script lang="ts">
    import { Textarea } from '@sivir-ui/svelte/components/textarea';
    import { type TextareaVariant, textareaContent } from '../playground/playground';

    let {
        value = $bindable(textareaContent.value),
        variant = 'outline',
        label = true,
        description = false,
        autoresize = false,
        disabled = false
    }: {
        value?: string;
        variant?: TextareaVariant;
        label?: boolean;
        description?: boolean;
        autoresize?: boolean;
        disabled?: boolean;
    } = $props();
</script>

<div class="w-full max-w-sm">
    <Textarea
        bind:value
        {variant}
        label={label ? textareaContent.label : undefined}
        description={description ? textareaContent.description : undefined}
        aria-label={label ? undefined : textareaContent.label}
        {autoresize}
        {disabled}
    />
</div>
