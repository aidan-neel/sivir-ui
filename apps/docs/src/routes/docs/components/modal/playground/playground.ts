import type { ModalOrientation, ModalSize } from '@sivir-ui/svelte/components/modal';

export type ModalPlaygroundSize = 'auto' | ModalSize;

export type ModalSettings = {
    orientation: ModalOrientation;
    size: ModalPlaygroundSize;
    showClose: boolean;
    allowClickOutside: boolean;
};

export const modalDefaults: ModalSettings = {
    orientation: 'vertical',
    size: 'auto',
    showClose: true,
    allowClickOutside: true
};

const LIBRARY_ORIENTATION: ModalOrientation = 'horizontal';

function attributes(props: string[]) {
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

function rootProps(settings: ModalSettings) {
    const props = ['bind:open'];

    if (settings.orientation !== LIBRARY_ORIENTATION) {
        props.push(`orientation="${settings.orientation}"`);
    }
    return props;
}

function contentProps(settings: ModalSettings) {
    const props: string[] = [];

    if (settings.size !== 'auto') {
        props.push(`size="${settings.size}"`);
    }
    if (!settings.showClose) {
        props.push('showClose={false}');
    }
    if (!settings.allowClickOutside) {
        props.push('allowClickOutside={false}');
    }
    return props;
}

export function modalCode(settings: ModalSettings) {
    return `<script lang="ts">
    import Globe from '@lucide/svelte/icons/globe';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
    let domain = $state('');
</script>

<Modal.Root${attributes(rootProps(settings))}>
    <Modal.Trigger>Add domain</Modal.Trigger>
    <Modal.Content${attributes(contentProps(settings))}>
        <Modal.Header>
            <div class="flex items-center gap-2.5">
                <Globe size={18} class="text-foreground-muted" />
                <Modal.Title>Add a domain</Modal.Title>
            </div>
            <Modal.Description>Add an existing domain to your sivir-ui project.</Modal.Description>
        </Modal.Header>
        <Modal.Body class="gap-4">
            <Input
                bind:value={domain}
                label="Domain"
                placeholder="example.com"
                description="We'll guide you through DNS configuration next."
            />
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Add
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
`;
}

export function changedModalProps(settings: ModalSettings) {
    const keys = Object.keys(modalDefaults) as (keyof ModalSettings)[];

    return keys.filter((key) => {
        return settings[key] !== modalDefaults[key];
    }).length;
}
