<script lang="ts">
    import * as Alert from '@sivir-ui/svelte/components/alert';
</script>

<div class="w-full max-w-md">
    <Alert.Root variant="warning">
        <Alert.Title>Storage almost full</Alert.Title>
        <Alert.Description>You have used 9.2 GB of your 10 GB limit.</Alert.Description>
    </Alert.Root>
</div>
