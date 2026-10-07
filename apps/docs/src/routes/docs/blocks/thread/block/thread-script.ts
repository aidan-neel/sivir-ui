export type ThreadSource = {
    domain: string;
    href: string;
    icon: string;
    title: string;
    description: string;
};

export type ThreadCitation = {
    label: string;
    sources: ThreadSource[];
};

export type ThreadSegment = {
    text: string;
    citation?: ThreadCitation;
};

export type ThreadThought = {
    title: string;
    body: string;
};

const nngroup: ThreadSource = {
    domain: 'nngroup.com',
    href: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
    icon: '/favicons/nngroup.com.png',
    title: 'Response Times: The 3 Important Limits',
    description:
        'The classic 0.1, 1 and 10 second limits for keeping attention and a sense of control while a system works.'
};

const animationFrame: ThreadSource = {
    domain: 'developer.mozilla.org',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame',
    icon: '/favicons/developer.mozilla.org.png',
    title: 'Window: requestAnimationFrame() method',
    description:
        'Schedules work right before the next repaint, the standard way to run smooth, frame-synced animation.'
};

const interactionToNextPaint: ThreadSource = {
    domain: 'web.dev',
    href: 'https://web.dev/articles/optimize-inp',
    icon: '/favicons/web.dev.png',
    title: 'Optimize Interaction to Next Paint',
    description: 'Keeping the main thread free so the page answers clicks, taps and typing quickly.'
};

const ariaBusy: ThreadSource = {
    domain: 'developer.mozilla.org',
    href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy',
    icon: '/favicons/developer.mozilla.org.png',
    title: 'ARIA: aria-busy attribute',
    description:
        'Tells assistive technology a region is still updating, so it can wait and announce the result once.'
};

export const question = 'How should a chat UI show that a model is still thinking?';

export const searchQuery = 'thinking indicator chat UI response time';

export const searchedSources: ThreadSource[] = [nngroup, animationFrame, interactionToNextPaint];

export const thoughts: ThreadThought[] = [
    {
        title: 'Framing the question',
        body: 'They want a pattern for the wait itself, not the final answer. The useful part is what to show while the model works.'
    },
    {
        title: 'Checking response-time limits',
        body: 'People notice a delay after about a second and drift after ten, so several seconds of reasoning needs feedback that changes, not a spinner.'
    },
    {
        title: 'Planning the layout',
        body: 'Name each step as it happens, keep the reasoning one tap away, and fold it into a short summary once the answer starts. Motion runs on the frame loop, and the answer stays aria-busy until it settles.'
    }
];

export const answer: ThreadSegment[][] = [
    [
        {
            text: 'Show progress, not just activity. People notice a delay after about a second and lose focus after ten, so a model that reasons for several seconds needs feedback that changes, naming each step as it happens.',
            citation: {
                label: 'Nielsen Norman Group',
                sources: [nngroup]
            }
        }
    ],
    [
        {
            text: 'Keep the reasoning one tap away. Let the label follow the work in a single line, and leave a short summary like “Worked for 6s” once the answer starts, with the full trail behind it.'
        }
    ],
    [
        {
            text: 'Drive the motion from the browser’s frame loop so the indicator and the text stay smooth without blocking input.',
            citation: {
                label: 'MDN',
                sources: [animationFrame, interactionToNextPaint]
            }
        },
        {
            text: 'Mark the answer as busy until it settles so screen readers announce it once.',
            citation: {
                label: 'MDN',
                sources: [ariaBusy]
            }
        }
    ]
];
