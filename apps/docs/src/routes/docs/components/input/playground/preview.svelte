<script lang="ts">
    import Mail from '@lucide/svelte/icons/mail';
    import { Input } from '@sivir-ui/svelte/components/input';
    import {
        INPUT_DESCRIPTION,
        INPUT_LABEL,
        INPUT_PLACEHOLDER,
        type InputSettings
    } from './playground';

    let {
        settings,
        value = $bindable()
    }: {
        settings: InputSettings;
        value: string;
    } = $props();
</script>

{#snippet leadingIcon()}
    <Mail />
{/snippet}

<div class="w-[min(20rem,calc(100vw-5rem))]">
    <Input
        bind:value
        variant={settings.variant}
        label={settings.label ? INPUT_LABEL : undefined}
        aria-label={settings.label ? undefined : INPUT_LABEL}
        description={settings.description ? INPUT_DESCRIPTION : undefined}
        placeholder={INPUT_PLACEHOLDER}
        disabled={settings.disabled}
        leading={settings.leading ? leadingIcon : undefined}
    />
</div>
