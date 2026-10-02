import { track } from '@vercel/analytics';

type ThemeExportFormat = 'css' | 'json';

type AnalyticsEvents = {
    install_command_copied: { source: 'home' | 'themes' };
    theme_exported: { format: ThemeExportFormat; source: 'studio' | 'themes' };
};

export function trackEvent<Name extends keyof AnalyticsEvents>(
    name: Name,
    properties: AnalyticsEvents[Name]
) {
    track(name, properties);
}
