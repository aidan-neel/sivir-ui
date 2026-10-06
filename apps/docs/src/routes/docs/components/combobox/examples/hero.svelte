<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    let {
        variant = 'outline',
        size = 'md',
        appearance = 'button',
        searchPlacement = 'trigger',
        disabled = false
    }: {
        variant?: 'outline' | 'secondary';
        size?: 'sm' | 'md' | 'lg';
        appearance?: 'button' | 'input';
        searchPlacement?: 'trigger' | 'menu';
        disabled?: boolean;
    } = $props();

    const items = [
        { value: 'option-1', label: 'Option 1' },
        { value: 'option-2', label: 'Option 2' },
        { value: 'option-3', label: 'Option 3' }
    ];
</script>

<div class="w-[280px]">
    <Combobox.Root>
        <Combobox.Trigger
            {variant}
            {size}
            {appearance}
            {searchPlacement}
            {disabled}
            placeholder="Select an option"
            class="w-full"
        />
        <Combobox.Content>
            <Combobox.Results>
                {#each items as item (item.value)}
                    <Combobox.Item value={item.value} label={item.label} callback={() => {}} />
                {/each}
            </Combobox.Results>
        </Combobox.Content>
    </Combobox.Root>
</div>
