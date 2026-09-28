import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolFixture from '../../fixtures/ToolFixture.svelte';

describe('Tool', () => {
    it('shows a spinner and shimmering title while running', () => {
        const { container } = render(ToolFixture, { props: { state: 'running' } });
        const trigger = container.querySelector('[data-ui="tool-trigger"]');

        expect(trigger?.querySelector('[data-ui="spinner"]')).toBeInTheDocument();
        expect(container.querySelector('.sivir-tool-shimmer')).toHaveTextContent(
            'Checked the deployment'
        );
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'true');
    });

    it('removes the spinner once complete', () => {
        const { container } = render(ToolFixture, { props: { state: 'complete' } });

        expect(container.querySelector('[data-ui="spinner"]')).not.toBeInTheDocument();
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'false');
    });

    it('starts collapsed and keeps content mounted after the first open', async () => {
        const { container, getByRole } = render(ToolFixture, { props: { state: 'complete' } });
        const trigger = getByRole('button', { name: /Checked the deployment/ });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('[data-ui="tool-call"]')).not.toBeInTheDocument();

        await fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(container.querySelector('[data-ui="tool-call"]')).toBeInTheDocument();

        await fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('[data-ui="tool-call"]')).toBeInTheDocument();
    });

    it('announces a failed group and a failed call', () => {
        const { container, getByText } = render(ToolFixture, {
            props: {
                state: 'error',
                open: true,
                callState: 'error'
            }
        });

        expect(getByText('Failed:')).toHaveClass('sr-only');
        expect(container.querySelector('[data-ui="tool-call"]')).toHaveTextContent('Failed');
    });

    it('renders a static row without details and a toggle with details', async () => {
        const { container, rerender, getByRole } = render(ToolFixture, {
            props: {
                state: 'complete',
                open: true
            }
        });

        expect(container.querySelector('[data-ui="tool-call"] button')).not.toBeInTheDocument();

        await rerender({
            state: 'complete',
            open: true,
            withDetails: true
        });

        const row = getByRole('button', { name: /vercel inspect/ });

        expect(row).toHaveAttribute('aria-expanded', 'false');
        await fireEvent.click(row);
        expect(row).toHaveAttribute('aria-expanded', 'true');
        expect(container.querySelector('[data-ui="tool-output"]')).toHaveTextContent('Ready');
    });
});
