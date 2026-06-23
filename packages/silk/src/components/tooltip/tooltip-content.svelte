<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	const tip = getContext('silk-tooltip') as { text: string };

	// The shared bubble renders the label itself (with a slot-text roll), so this
	// just hosts the authored content off-screen and reports its text up to the
	// context — a MutationObserver keeps dynamic labels (Copy → Copied) current.
	let el = $state<HTMLElement>();

	onMount(() => {
		if (!el) return;
		const sync = () => {
			tip.text = (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
		};
		sync();
		const mo = new MutationObserver(sync);
		mo.observe(el, { childList: true, characterData: true, subtree: true });
		return () => mo.disconnect();
	});
</script>

<span
	bind:this={el}
	aria-hidden="true"
	style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
>
	{@render children?.()}
</span>
