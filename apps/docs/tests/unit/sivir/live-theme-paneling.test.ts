import { applyLiveThemeCss } from '@sivir-ui/svelte/themes/live';
import { menuPanelingOffCss, surfacePanelingOffCss } from '@sivir-ui/svelte/themes/theme';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => {
    return { browser: true };
});

describe('applyLiveThemeCss paneling', () => {
    let styleTag: { id: string; textContent: string };
    let storage: Map<string, string>;

    beforeEach(() => {
        styleTag = { id: '', textContent: '' };
        storage = new Map();
        vi.stubGlobal('document', {
            getElementById: () => {
                return styleTag;
            },
            head: { appendChild: () => undefined }
        });
        vi.stubGlobal('localStorage', {
            setItem: (key: string, value: string) => {
                storage.set(key, value);
            }
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('rolls paneling rules back to the cascade layer when the theme leaves paneling on', () => {
        applyLiveThemeCss(':root { --radius-md: 8px; }\n');

        expect(styleTag.textContent).toContain('--sivir-modal-inset: revert-layer;');
        expect(styleTag.textContent).toContain('.sivir-card-frame');
        expect(styleTag.textContent).not.toContain('--sivir-modal-inset: 0px;');
        expect(storage.get('sivir-live-theme-css')).toBe(styleTag.textContent);
    });

    it('keeps the paneling-off rules untouched when the theme turns paneling off', () => {
        const css = menuPanelingOffCss() + surfacePanelingOffCss();

        applyLiveThemeCss(css);

        expect(styleTag.textContent).toBe(css);
    });

    it('only restores the paneling group the theme did not switch off', () => {
        const css = menuPanelingOffCss();

        applyLiveThemeCss(css);

        expect(styleTag.textContent.startsWith(css)).toBe(true);
        expect(styleTag.textContent).toContain('.sivir-modal-frame');
        expect(styleTag.textContent).toContain('revert-layer');
    });
});
