<script lang="ts">
    import * as Alert from '@sivir-ui/svelte/components/alert';
</script>

<div class="w-full max-w-md">
    <Alert.Root variant="info">
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>
            Deploys are paused on Saturday from 02:00 to 04:00 UTC.
        </Alert.Description>
    </Alert.Root>
</div>
