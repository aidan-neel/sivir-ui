<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { type ToastAction, toast } from '@sivir-ui/svelte/components/toast';
    import { type ToastSettings, toastContent } from '../playground/playground';

    let { type, description, action, duration, closeButton }: ToastSettings = $props();

    function actions(): ToastAction[] | undefined {
        if (!action) {
            return undefined;
        }
        if (toastContent[type].action === 'retry') {
            return [
                {
                    label: 'Retry',
                    callback: deploy
                }
            ];
        }
        return [
            {
                label: 'Visit',
                callback: () => {
                    window.open('https://sivir.dev', '_blank');
                }
            }
        ];
    }

    function deploy() {
        const content = toastContent[type];
        const persistent = duration === 'persistent';

        toast({
            title: content.title,
            type,
            description: description ? content.description : undefined,
            actions: actions(),
            duration: persistent ? undefined : Number(duration),
            persistent,
            exitable: closeButton
        });
    }
</script>

<div class="flex items-center justify-center">
    <Button onclick={deploy}>Deploy</Button>
</div>
