import type { ButtonProps } from '@sivir-ui/svelte/components/button';
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Root from './attachment.svelte';
import Item from './attachment-item.svelte';
import List from './attachment-list.svelte';
import Name from './attachment-name.svelte';
import Preview from './attachment-preview.svelte';
import Remove from './attachment-remove.svelte';
import Status from './attachment-status.svelte';
import Trigger from './attachment-trigger.svelte';

export type AttachmentRejectionCode =
    | 'duplicate-file'
    | 'file-invalid-type'
    | 'file-too-large'
    | 'too-many-files';

export type AttachmentRejection = {
    file: File;
    code: AttachmentRejectionCode;
    reason: string;
};

export type AttachmentStatus = 'ready' | 'uploading' | 'complete' | 'error';

export type AttachmentProps = {
    files?: File[];
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    /** Attaches files pasted into any focused element inside the root. */
    addOnPaste?: boolean;
    onReject?: (rejections: AttachmentRejection[]) => void;
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type AttachmentTriggerProps = {
    class?: string;
    children?: Snippet;
    element?: HTMLButtonElement | HTMLAnchorElement;
    onclick?: (event: MouseEvent) => void;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
} & Omit<HTMLButtonAttributes, 'children' | 'class' | 'type' | 'onclick'>;

export type AttachmentListProps = {
    label?: string;
    class?: string;
    children?: Snippet<[File]>;
} & Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'class'>;

export type AttachmentItemProps = {
    file: File;
    status?: AttachmentStatus;
    progress?: number;
    error?: string;
    onRemove?: (file: File) => void;
    removable?: boolean;
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type AttachmentPreviewProps = {
    class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type AttachmentNameProps = {
    class?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'class' | 'title'>;

export type AttachmentStatusProps = {
    class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type AttachmentRemoveProps = {
    class?: string;
    onclick?: (event: MouseEvent) => void;
} & Omit<HTMLButtonAttributes, 'children' | 'class' | 'type' | 'onclick'>;

export { Item, List, Name, Preview, Remove, Root, Status, Trigger };
