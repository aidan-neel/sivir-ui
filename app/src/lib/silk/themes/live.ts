import { browser } from '$app/environment';

const STORAGE_KEY = 'silk-live-theme-css';
const STYLE_ID = 'silk-live-theme-style';

function normalizeThemeCss(css: string) {
	return css.replace('@theme', ':root');
}

function getStyleTag() {
	if (!browser) return null;

	let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
	if (tag) return tag;

	tag = document.createElement('style');
	tag.id = STYLE_ID;
	document.head.appendChild(tag);
	return tag;
}

export function applyLiveThemeCss(css: string) {
	if (!browser) return;
	const normalized = normalizeThemeCss(css);
	const tag = getStyleTag();
	if (!tag) return;
	tag.textContent = normalized;
	localStorage.setItem(STORAGE_KEY, normalized);
}

export function hydrateLiveThemeCss() {
	if (!browser) return;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return;
	const tag = getStyleTag();
	if (!tag) return;
	tag.textContent = stored;
}

export function clearLiveThemeCss() {
	if (!browser) return;
	localStorage.removeItem(STORAGE_KEY);
	const tag = document.getElementById(STYLE_ID);
	tag?.remove();
}
