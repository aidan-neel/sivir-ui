<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const text =
        'This text streams in at a steady pace. Use response streaming to make an AI answer feel immediate while preserving the layout of the surrounding message. Arrivals queue behind the reveal, which speeds up when it falls behind, and the newest characters fade in as they land.';

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function* delayedResponse() {
        await wait(1200);

        const parts = text.split(/(\s+)/);
        for (const part of parts) {
            yield part;
            await wait(40);
        }
    }
</script>

<div class="w-full max-w-xl">
    <ResponseStream textStream={delayedResponse()} speed={10} />
</div>
