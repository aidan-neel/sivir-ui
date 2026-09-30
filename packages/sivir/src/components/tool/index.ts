import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Root from './tool.svelte';
import Call from './tool-call.svelte';
import Content from './tool-content.svelte';
import Input from './tool-input.svelte';
import Output from './tool-output.svelte';
import Trigger from './tool-trigger.svelte';

export type ToolState = 'running' | 'complete' | 'error';

export type ToolRootProps = {
    state?: ToolState;
    /** Whether the tool calls are visible. Defaults to `false`. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type ToolTriggerState = Readonly<{
    open: boolean;
    state: ToolState;
}>;

type ToolTriggerBaseProps = {
    /** Elapsed time for the whole group, such as 4.2s. Update it while running for a live timer. */
    duration?: string;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'title'>;

export type ToolTriggerProps = ToolTriggerBaseProps &
    (
        | {
              /** A sentence summarizing the group, such as Read 3 files, searched once. */
              title: string;
              children?: never;
          }
        | {
              title?: never;
              children: Snippet<[ToolTriggerState]>;
          }
    );

export type ToolContentProps = DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>;

export type ToolCallProps = {
    /** What the call does, such as Read file or Reading file while running. */
    action: string;
    /** What the call acts on, such as a path, query, or command. */
    target?: string;
    state?: ToolState;
    /** How long the call took, such as 80ms. */
    duration?: string;
    /** Whether the call details are visible. Only applies when the call has children. */
    open?: boolean;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ToolInputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ToolOutputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export { Call, Content, Input, Output, Root, Trigger };
