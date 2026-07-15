import { browser } from '$app/environment';
import type { Theme } from './theme';
import type { ThemeDraft, ThemeBasePalette } from '@sivir/ui/themes/presets';

const STORAGE_KEY = 'sivir-live-theme-css';
const STYLE_ID = 'sivir-live-theme-style';
const STUDIO_STATE_KEY = 'sivir-theme-studio-state';
const STUDIO_THEME_V2_KEY = 'sivir-studio-theme-v2';

export type ThemeStudioState = {
	selectedPresetSlug: string;
	editorTheme: ThemeDraft;
	editorName: string;
	headerFontSelection: string;
	bodyFontSelection: string;
	lightBasePalette: ThemeBasePalette;
	darkBasePalette: ThemeBasePalette;
};

/** Converts the theme export format into a live-applicable root block. */
function normalizeThemeCss(css: string) {
	return css.replace('@theme', ':root');
}

/** Returns the shared live-theme style tag, creating it when needed. */
function getStyleTag() {
	if (!browser) return null;

	let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
	if (tag) return tag;

	tag = document.createElement('style');
	tag.id = STYLE_ID;
	document.head.appendChild(tag);
	return tag;
}

/** Applies live theme CSS to the document and persists it for reloads. */
export function applyLiveThemeCss(css: string) {
	if (!browser) return;
	const normalized = normalizeThemeCss(css);
	const tag = getStyleTag();
	if (!tag) return;
	tag.textContent = normalized;
	localStorage.setItem(STORAGE_KEY, normalized);
}

/** Restores the last saved live theme CSS during app startup. */
export function hydrateLiveThemeCss() {
	if (!browser) return;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return;
	const tag = getStyleTag();
	if (!tag) return;
	tag.textContent = stored;
}

/** Returns the currently persisted live theme CSS override, if one exists. */
export function getStoredLiveThemeCss() {
	if (!browser) return null;
	return localStorage.getItem(STORAGE_KEY);
}

/** Removes the live theme override from the document and storage. */
export function clearLiveThemeCss() {
	if (!browser) return;
	localStorage.removeItem(STORAGE_KEY);
	const tag = document.getElementById(STYLE_ID);
	tag?.remove();
}

/** Persists the current theme studio draft for later restoration. */
export function saveThemeStudioState(state: ThemeStudioState) {
	if (!browser) return;
	localStorage.setItem(STUDIO_STATE_KEY, JSON.stringify(state));
}

/** Restores the last saved theme studio draft when one is available. */
export function loadThemeStudioState() {
	if (!browser) return null;

	const stored = localStorage.getItem(STUDIO_STATE_KEY);
	if (!stored) return null;

	try {
		return JSON.parse(stored) as ThemeStudioState;
	} catch {
		localStorage.removeItem(STUDIO_STATE_KEY);
		return null;
	}
}

const SAVED_THEMES_KEY = 'sivir-saved-themes';

export type SavedTheme = ThemeDraft & { id: string; savedAt: string };

function randomId() {
	if (browser && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `local-${crypto.randomUUID()}`;
	}
	return `local-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function backfillId<T extends ThemeDraft & { savedAt?: string; id?: string }>(
	entry: T
): SavedTheme {
	return {
		...(entry as unknown as ThemeDraft),
		id: entry.id ?? randomId(),
		savedAt: entry.savedAt ?? new Date().toISOString()
	};
}

/** Returns all locally-saved custom themes, newest first. */
export function getSavedThemes(): SavedTheme[] {
	if (!browser) return [];
	const stored = localStorage.getItem(SAVED_THEMES_KEY);
	if (!stored) return [];
	try {
		const parsed = JSON.parse(stored) as Partial<SavedTheme>[];
		if (!Array.isArray(parsed)) return [];
		// Migrate any legacy entries that pre-date the `id` field.
		let needsRewrite = false;
		const migrated = parsed.map((entry) => {
			if (!entry?.id) needsRewrite = true;
			return backfillId(entry as ThemeDraft & { savedAt?: string; id?: string });
		});
		if (needsRewrite) {
			localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(migrated));
		}
		return migrated.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
	} catch {
		localStorage.removeItem(SAVED_THEMES_KEY);
		return [];
	}
}

/**
 * Persists a theme as a brand-new local entry. Every save mints a fresh ID
 * so name/slug collisions never overwrite an existing saved theme -- pass the
 * `id` of an existing entry to update it in place instead.
 */
export function saveLocalTheme(theme: ThemeDraft, existingId?: string): SavedTheme {
	const entry: SavedTheme = {
		...theme,
		id: existingId ?? randomId(),
		savedAt: new Date().toISOString()
	};
	if (!browser) return entry;
	const current = getSavedThemes().filter((t) => t.id !== entry.id);
	const next = [entry, ...current];
	localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next));
	return entry;
}

/** Removes a saved theme by ID. */
export function deleteLocalTheme(id: string) {
	if (!browser) return;
	const next = getSavedThemes().filter((t) => t.id !== id);
	localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next));
}

/** Persists a v2 Theme to localStorage for the studio to restore on mount. */
export function saveStudioThemeV2(theme: Theme) {
	if (!browser) return;
	localStorage.setItem(STUDIO_THEME_V2_KEY, JSON.stringify(theme));
}

/** Restores the last saved v2 Theme from localStorage, if one exists. */
export function loadStudioThemeV2(): Theme | null {
	if (!browser) return null;
	const stored = localStorage.getItem(STUDIO_THEME_V2_KEY);
	if (!stored) return null;
	try {
		return JSON.parse(stored) as Theme;
	} catch {
		localStorage.removeItem(STUDIO_THEME_V2_KEY);
		return null;
	}
}
