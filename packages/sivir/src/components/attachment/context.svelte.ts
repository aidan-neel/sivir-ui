import { getContext, hasContext, setContext } from 'svelte';
import type { AttachmentStatus } from '.';

export type AttachmentContext = {
    files: File[];
    readonly disabled: boolean;
    open: () => void;
    remove: (file: File) => void;
};

export type AttachmentItemContext = {
    readonly file: File;
    readonly status: AttachmentStatus;
    readonly progress: number | undefined;
    readonly error: string | undefined;
    readonly removable: boolean;
    remove: () => void;
};

const rootKey = Symbol('sivir.attachment');
const itemKey = Symbol('sivir.attachment-item');

function setAttachmentContext(context: AttachmentContext) {
    return setContext(rootKey, context);
}

function getAttachmentContext() {
    if (!hasContext(rootKey)) {
        throw new Error('Attachment components must be used within <Attachment.Root>.');
    }

    return getContext<AttachmentContext>(rootKey);
}

function findAttachmentContext() {
    return getContext<AttachmentContext | undefined>(rootKey);
}

function setAttachmentItemContext(context: AttachmentItemContext) {
    return setContext(itemKey, context);
}

function getAttachmentItemContext() {
    if (!hasContext(itemKey)) {
        throw new Error('Attachment item parts must be used within <Attachment.Item>.');
    }

    return getContext<AttachmentItemContext>(itemKey);
}

export {
    findAttachmentContext,
    getAttachmentContext,
    getAttachmentItemContext,
    setAttachmentContext,
    setAttachmentItemContext
};
