import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Root from './reasoning.svelte';
import Content from './reasoning-content.svelte';
import Trigger from './reasoning-trigger.svelte';

export type ReasoningRootProps = {
    streaming?: boolean;
    /** Whether the reasoning content is visible. Defaults to `false`. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type ReasoningTriggerProps = {
    /** Replaces the Thinking and Thought for label, such as a one-line summary of the reasoning. */
    title?: string;
    /** Elapsed reasoning time, such as 2.4s. Update it while streaming for a live timer. Hidden when `title` is set. */
    duration?: string;
    children?: Snippet<[ReasoningTriggerState]>;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'title'>;

export type ReasoningTriggerState = Readonly<{
    open: boolean;
    streaming: boolean;
}>;

export type ReasoningContentProps = DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>;

export { Content, Root, Trigger };
