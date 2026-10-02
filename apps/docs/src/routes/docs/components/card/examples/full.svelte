<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root class="w-full max-w-[28rem]">
    <Card.Header>
        <Card.Title>Workspace seats</Card.Title>
        <Card.Description>Billed monthly for each active member.</Card.Description>
    </Card.Header>
    <Card.Content>
        <p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
            Team plan. 12 of 25 seats used.
        </p>
    </Card.Content>
    <Card.Footer>
        <Button variant="outline" size="md">View invoices</Button>
        <Button size="md">Add seats</Button>
    </Card.Footer>
</Card.Root>
