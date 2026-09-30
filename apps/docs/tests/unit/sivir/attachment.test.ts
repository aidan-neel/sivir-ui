import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AttachmentFixture from '../../fixtures/AttachmentFixture.svelte';
import { queryRequired } from '../../test-utils';

async function chooseFiles(input: HTMLInputElement, files: File[]) {
    Object.defineProperty(input, 'files', { configurable: true, value: files });
    await fireEvent.change(input);
}

describe('Attachment', () => {
    it('adds accepted files and removes the rendered item', async () => {
        const { container } = render(AttachmentFixture);
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['release notes'], 'release-notes.txt', {
            type: 'text/plain',
            lastModified: 1
        });

        await chooseFiles(input, [file]);

        expect(screen.getByRole('list', { name: 'Attachments' })).toBeInTheDocument();
        expect(screen.getByTitle('release-notes.txt')).toBeInTheDocument();
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
        await userEvent
            .setup()
            .click(screen.getByRole('button', { name: 'Remove release-notes.txt' }));

        await waitFor(() => {
            expect(screen.queryByTitle('release-notes.txt')).not.toBeInTheDocument();
            expect(screen.queryByRole('list', { name: 'Attachments' })).not.toBeInTheDocument();
        });
    });

    it('rejects an invalid file type with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { accept: '.txt' } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['report'], 'report.pdf', {
            type: 'application/pdf',
            lastModified: 2
        });

        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent(
            'report.pdf:file-invalid-type'
        );
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('0');
    });

    it('rejects an oversized file with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { maxSize: 4 } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['12345'], 'large.txt', { type: 'text/plain', lastModified: 3 });

        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('large.txt:file-too-large');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('0');
    });

    it('rejects a duplicate file with a typed code', async () => {
        const { container } = render(AttachmentFixture);
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['same'], 'same.txt', { type: 'text/plain', lastModified: 4 });

        await chooseFiles(input, [file]);
        await chooseFiles(input, [file]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('same.txt:duplicate-file');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
    });

    it('rejects files beyond the maximum count with a typed code', async () => {
        const { container } = render(AttachmentFixture, { props: { maxFiles: 1 } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const first = new File(['one'], 'one.txt', { type: 'text/plain', lastModified: 5 });
        const second = new File(['two'], 'two.txt', { type: 'text/plain', lastModified: 6 });

        await chooseFiles(input, [first, second]);

        expect(screen.getByTestId('rejection-codes')).toHaveTextContent('two.txt:too-many-files');
        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
        expect(screen.getByTitle('one.txt')).toBeInTheDocument();
    });

    it('attaches files pasted into a field inside the root', async () => {
        render(AttachmentFixture);
        const file = new File(['pasted'], 'pasted.txt', { type: 'text/plain', lastModified: 7 });

        await fireEvent.paste(screen.getByRole('textbox', { name: 'Prompt' }), {
            clipboardData: { files: [file] }
        });

        expect(screen.getByTestId('attachment-count')).toHaveTextContent('1');
        expect(screen.getByTitle('pasted.txt')).toBeInTheDocument();
    });

    it('ignores pasted files when addOnPaste is false', async () => {
        render(AttachmentFixture, { props: { addOnPaste: false } });
        const file = new File(['pasted'], 'pasted.txt', { type: 'text/plain', lastModified: 8 });

        await fireEvent.paste(screen.getByRole('textbox', { name: 'Prompt' }), {
            clipboardData: { files: [file] }
        });

        expect(screen.getByTestId('attachment-count')).toHaveTextContent('0');
    });

    it('moves focus to the next file, then the trigger, after removal', async () => {
        const user = userEvent.setup();
        const { container } = render(AttachmentFixture);
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const first = new File(['one'], 'one.txt', { type: 'text/plain', lastModified: 9 });
        const second = new File(['two'], 'two.txt', { type: 'text/plain', lastModified: 10 });

        await chooseFiles(input, [first, second]);
        screen.getByRole('button', { name: 'Remove one.txt' }).focus();
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Remove two.txt' })).toHaveFocus();
        });

        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Choose files' })).toHaveFocus();
        });
    });

    it('renders composed items from the list snippet', async () => {
        const { container } = render(AttachmentFixture, { props: { composed: true } });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="file"]');
        const file = new File(['draft'], 'draft.txt', { type: 'text/plain', lastModified: 11 });

        await chooseFiles(input, [file]);

        expect(screen.getByTitle('draft.txt')).toBeInTheDocument();
        expect(
            screen.getByRole('progressbar', { name: 'Upload progress for draft.txt' })
        ).toHaveAttribute('aria-valuenow', '40');
        expect(screen.queryByRole('button', { name: 'Remove draft.txt' })).not.toBeInTheDocument();
    });
});
