<script lang="ts">
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root variant="panel" class="w-full max-w-[22rem]">
    <Card.Header>
        <Card.Title>Build minutes</Card.Title>
        <Card.Description>Resets on the first of each month.</Card.Description>
    </Card.Header>
    <Card.Content>
        <p class="m-0 text-sm text-foreground-muted">
            1,284 of 5,000 minutes used. Builds queue when you reach the limit.
        </p>
    </Card.Content>
</Card.Root>
