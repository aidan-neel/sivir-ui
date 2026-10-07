<script lang="ts">
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<div class="grid place-items-center">
    <AlertDialog.Root error>
        <AlertDialog.Trigger variant="destructive">Discard changes</AlertDialog.Trigger>
        <AlertDialog.Content size="lg">
            <AlertDialog.Header>
                <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
                <AlertDialog.Description>
                    You have 3 unsaved changes that will be lost if you leave this page.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>
                    Keep editing
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm>
                    Discard
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
