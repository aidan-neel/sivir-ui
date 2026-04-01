<script lang="ts">
	type ApiReferenceItem = {
		property: string;
		type: string;
		description: string;
		defaults: string;
	};

	const {
		title,
		component,
		items,
		description
	}: {
		title: string;
		component: string;
		items: ApiReferenceItem[];
		description: string;
	} = $props();
</script>

<div class="w-full flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<p class="bg-secondary w-fit rounded-lg px-3 py-1 text-lg font-mono">
			<span class="text-foreground-muted">
				{title}
			</span>.<span class="font-semibold">
				{component}
			</span>
		</p>
		<p class="text-[0.98rem] leading-7 text-foreground-muted">
			{description}
		</p>
	</header>

	{#if items.length !== 0}
		<table class="w-full border-collapse text-left">
			<thead>
				<tr class="border-b">
					<th class="p-3 text-foreground-muted font-medium">Property</th>
					<th class="p-3 text-foreground-muted font-medium">Type</th>
					<th class="p-3 text-foreground-muted font-medium">Description</th>
				</tr>
			</thead>
			<tbody>
				{#each items as { property, type, description, defaults }}
					<tr class="border-t">
						<td class="p-3 font-mono w-1/3">
							<span class="bg-secondary px-2 p-1 rounded-lg font-medium text-sm">
								{property}
							</span>
						</td>
						<td class="p-3 text-foreground-muted font-mono text-sm">{type}</td>
						<td class="p-3 text-sm"
							>{description}<br />
							<span class="font-mono text-foreground-muted text-sm mt-2">
								Default: {defaults ?? '-'}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
