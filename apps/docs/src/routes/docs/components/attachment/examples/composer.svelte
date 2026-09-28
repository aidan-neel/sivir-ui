<script lang="ts">
    import * as Attachment from '@sivir-ui/svelte/components/attachment';
    import * as Composer from '@sivir-ui/svelte/components/composer';

    let files = $state<File[]>([]);
    let value = $state('');

    async function send() {
        await new Promise((resolve) => {
            setTimeout(resolve, 600);
        });
        value = '';
        files = [];
    }
</script>

<Attachment.Root bind:files class="w-full max-w-2xl">
    <Composer.Root bind:value onSubmit={send}>
        <Attachment.List class="px-3 pt-3" />
        <Composer.Input aria-label="Prompt" placeholder="Paste a screenshot or drop files..." />
        <Composer.Toolbar>
            <Composer.Actions>
                <Attachment.Trigger />
            </Composer.Actions>
            <Composer.Submit />
        </Composer.Toolbar>
    </Composer.Root>
</Attachment.Root>
