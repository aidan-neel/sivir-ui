<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    let {
        speed = 10,
        source = 'stream'
    }: {
        speed?: number;
        source?: 'stream' | 'text';
    } = $props();

    const text = 'This is a streaming response that appears word by word as it arrives.';

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function* streamText() {
        const parts = text.split(/(\s+)/);
        for (const part of parts) {
            yield part;
            await wait(30);
        }
    }
</script>

<ResponseStream textStream={source === 'stream' ? streamText() : text} {speed} />
