import type { ModalOrientation, ModalSize } from '@sivir-ui/svelte/components/modal';

export type AlertDialogSettings = {
    error: boolean;
    orientation: ModalOrientation;
    size: ModalSize;
    allowEscape: boolean;
};

export const alertDialogDefaults: AlertDialogSettings = {
    error: true,
    orientation: 'vertical',
    size: 'lg',
    allowEscape: true
};

function attributes(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function rootProps(settings: AlertDialogSettings) {
    const props: string[] = [];

    if (settings.error) {
        props.push('error');
    }
    if (settings.orientation !== 'vertical') {
        props.push(`orientation="${settings.orientation}"`);
    }
    return attributes(props);
}

function contentProps(settings: AlertDialogSettings) {
    const props: string[] = [];

    if (settings.size !== 'sm') {
        props.push(`size="${settings.size}"`);
    }
    if (!settings.allowEscape) {
        props.push('allowEscape={false}');
    }
    return attributes(props);
}

function exitShortcut(settings: AlertDialogSettings) {
    if (!settings.allowEscape) {
        return '';
    }
    return '\n                <Shortcut shortcut="esc" />';
}

export function alertDialogCode(settings: AlertDialogSettings) {
    return `<script lang="ts">
    import Trash from '@lucide/svelte/icons/trash-2';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<AlertDialog.Root${rootProps(settings)}>
    <AlertDialog.Trigger variant="destructive">
        <Trash size={14} />
        Delete workspace
    </AlertDialog.Trigger>
    <AlertDialog.Content${contentProps(settings)}>
        <AlertDialog.Header>
            <div class="flex items-center gap-2.5">
                <Trash size={18} class="text-[var(--color-error)]" />
                <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
            </div>
            <AlertDialog.Description>
                All projects, comments, and exports will be removed. This action cannot be
                undone.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Exit>
                Cancel${exitShortcut(settings)}
            </AlertDialog.Exit>
            <AlertDialog.Confirm>
                Delete
                <Shortcut shortcut="enter" />
            </AlertDialog.Confirm>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
`;
}

export function changedAlertDialogProps(settings: AlertDialogSettings) {
    const keys = Object.keys(alertDialogDefaults) as (keyof AlertDialogSettings)[];

    return keys.filter((key) => {
        return settings[key] !== alertDialogDefaults[key];
    }).length;
}
