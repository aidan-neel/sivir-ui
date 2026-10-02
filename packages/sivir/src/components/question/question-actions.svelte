<script lang="ts">
    import * as Card from '@sivir-ui/svelte/components/card';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionActionsProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let { class: className, children, ...rest }: QuestionActionsProps = $props();
    const context = getQuestionContext();
</script>

<Card.Footer class="m-0 block p-0">
    <div
        {...rest}
        data-ui="question-actions"
        data-state={context.status}
        class={cn(
            className,
            'flex flex-wrap items-center justify-end gap-2',
            context.variant === 'inset' ? 'px-2 py-1' : 'px-3 pb-3'
        )}
    >
        {@render children?.()}
    </div>
</Card.Footer>
