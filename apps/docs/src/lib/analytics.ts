import { track } from '@vercel/analytics';

type ThemeExportFormat = 'css' | 'json';

type AnalyticsEvents = {
    install_command_copied: { source: 'home' | 'themes' };
    theme_exported: { format: ThemeExportFormat; source: 'studio' | 'themes' };
    component_viewed: { component: string };
    studio_viewed: undefined;
    github_visited: { target: string; from: string };
};

type EventArguments<Name extends keyof AnalyticsEvents> = AnalyticsEvents[Name] extends undefined
    ? [name: Name]
    : [name: Name, properties: AnalyticsEvents[Name]];

const COMPONENT_PATH_PATTERN = /^\/docs\/components\/([^/]+)\/?$/;
const GITHUB_HOST = 'github.com';

export function trackEvent<Name extends keyof AnalyticsEvents>(...args: EventArguments<Name>) {
    const [name, properties] = args as [Name, Record<string, string> | undefined];

    track(name, properties);
}

export function trackPageView(pathname: string) {
    const component = COMPONENT_PATH_PATTERN.exec(pathname)?.[1];

    if (component) {
        trackEvent('component_viewed', { component });
        return;
    }

    if (pathname === '/studio' || pathname.startsWith('/studio/')) {
        trackEvent('studio_viewed');
    }
}

export function trackGitHubClick(event: MouseEvent) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const anchor = event.target.closest('a');

    if (!anchor || anchor.hostname !== GITHUB_HOST) {
        return;
    }

    trackEvent('github_visited', {
        target: anchor.pathname,
        from: window.location.pathname
    });
}
