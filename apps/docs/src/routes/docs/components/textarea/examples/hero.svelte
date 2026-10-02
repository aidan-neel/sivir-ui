<script lang="ts">
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let value = $state(
        'The export finished, but three rows were skipped because their dates were empty. Can you check the source file?'
    );
</script>

<div class="w-full max-w-sm">
    <Textarea bind:value label="Message" />
</div>
