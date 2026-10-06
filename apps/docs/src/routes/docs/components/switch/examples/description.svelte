<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';

    let autoSave = $state(true);
    let spellCheck = $state(true);
    let offline = $state(false);
</script>

<div class="w-full max-w-sm space-y-4">
    <Switch
        bind:checked={autoSave}
        label="Auto-save"
        description="Save drafts every 30 seconds while you edit."
    />
    <Switch
        bind:checked={spellCheck}
        label="Spell check"
        description="Highlight misspelled words as you type."
    />
    <Switch
        bind:checked={offline}
        label="Work offline"
        description="Keep writing without an internet connection."
    />
</div>
