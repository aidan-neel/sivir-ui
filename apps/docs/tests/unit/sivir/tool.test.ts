import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolFixture from '../../fixtures/ToolFixture.svelte';

describe('Tool', () => {
    it('shimmers the live status and opens while running', () => {
        const { container } = render(ToolFixture, {
            props: {
                running: true
            }
        });
        const trigger = container.querySelector('[data-ui="tool-trigger"]');

        expect(container.querySelector('.sivir-tool-shimmer')).toHaveTextContent(
            'Checking the deployment'
        );
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'true');
    });

    it('settles into the summary once running ends', () => {
        const { container } = render(ToolFixture);

        expect(container.querySelector('[data-ui="tool-trigger"]')).toHaveTextContent(
            'Checked the deployment'
        );
        expect(container.querySelector('.sivir-tool-shimmer')).not.toBeInTheDocument();
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'false');
    });

    it('starts collapsed and keeps content mounted after the first open', async () => {
        const { container, getByRole } = render(ToolFixture);
        const trigger = getByRole('button', {
            name: /Checked the deployment/
        });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('[data-ui="tool-call"]')).not.toBeInTheDocument();

        await fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(container.querySelector('[data-ui="tool-call"]')).toBeInTheDocument();

        await fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(container.querySelector('[data-ui="tool-call"]')).toBeInTheDocument();
    });

    it('marks a failed call', () => {
        const { container } = render(ToolFixture, {
            props: {
                open: true,
                callState: 'error'
            }
        });
        const call = container.querySelector('[data-ui="tool-call"]');

        expect(call).toHaveAttribute('data-state', 'error');
        expect(call).toHaveTextContent('Failed');
    });

    it('renders a static row without details and a toggle with details', async () => {
        const { container, rerender, getByRole } = render(ToolFixture, {
            props: {
                open: true
            }
        });

        expect(container.querySelector('[data-ui="tool-call"] button')).not.toBeInTheDocument();

        await rerender({
            open: true,
            withDetails: true
        });

        const row = getByRole('button', {
            name: /vercel inspect/
        });

        expect(row).toHaveAttribute('aria-expanded', 'false');
        await fireEvent.click(row);
        expect(row).toHaveAttribute('aria-expanded', 'true');
        expect(container.querySelector('[data-ui="tool-output"]')).toHaveTextContent('Ready');
    });
});
