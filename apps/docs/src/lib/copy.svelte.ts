/**
 * Clipboard helper for docs pages. Tracks which snippet was last copied so a
 * single component can show a transient "copied" check on the right control.
 *
 *   const clip = createCopy();
 *   <button onclick={() => clip.copy(code, 'snippet')}>
 *     {#if clip.copied('snippet')}Copied{/if}
 *   </button>
 */
export function createCopy(timeout = 1600) {
	let key = $state<string | null>(null);

	return {
		/** True while `id` is the most recently copied key. */
		copied: (id: string) => key === id,
		copy(text: string, id: string) {
			if (typeof navigator === 'undefined' || !navigator.clipboard) return;
			void navigator.clipboard.writeText(text);
			key = id;
			setTimeout(() => {
				if (key === id) key = null;
			}, timeout);
		}
	};
}
