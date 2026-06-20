import { browser } from '$app/environment';
import type { Theme } from './theme';

const STORAGE_KEY = 'silk-live-theme-css';
const STYLE_ID = 'silk-live-theme-style';
const STUDIO_THEME_V2_KEY = 'silk-studio-theme-v2';

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
