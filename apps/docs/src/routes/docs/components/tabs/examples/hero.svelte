<script lang="ts">
	import * as Tabs from '@sivir/ui/components/tabs';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import GitBranch from '@lucide/svelte/icons/git-branch';
	import Clock from '@lucide/svelte/icons/clock';

	let activeTab = $state('overview');
</script>

<div class="flex justify-center p-8">
	<div class="w-full max-w-[30rem]">
		<Tabs.Root bind:value={activeTab}>
			<Tabs.List class="grid w-full grid-cols-4">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="deployments">Deployments</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
			</Tabs.List>

			<!-- Overview Tab -->
			<Tabs.Content value="overview" class="space-y-4 pt-4">
				<div class="rounded-lg border border-border bg-surface p-4">
					<div class="mb-3 flex items-center gap-2">
						<div class="flex h-2 w-2 rounded-full bg-green-500"></div>
						<span class="text-sm font-semibold text-foreground">Production</span>
					</div>
					<div class="mb-2 text-xs text-foreground-muted">sivir-ui.vercel.app</div>
					<div class="text-xs text-foreground-muted">Deployed 2h ago by aidan-neel</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-lg border border-border bg-surface p-3">
						<div class="text-xs font-medium text-foreground-muted mb-1">Uptime</div>
						<div class="text-lg font-semibold text-foreground">100%</div>
					</div>
					<div class="rounded-lg border border-border bg-surface p-3">
						<div class="text-xs font-medium text-foreground-muted mb-1">Edge Requests</div>
						<div class="text-lg font-semibold text-foreground">12.4k</div>
					</div>
				</div>
			</Tabs.Content>

			<!-- Deployments Tab -->
			<Tabs.Content value="deployments" class="space-y-2 pt-4">
				<div class="space-y-3">
					<div class="rounded-lg border border-border bg-surface p-3">
						<div class="mb-2 flex items-start justify-between">
							<div class="flex-1">
								<div class="text-sm font-medium text-foreground">feat(studio): restore styling</div>
								<div class="flex gap-2 mt-1">
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<GitBranch size={12} />
										main
									</span>
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<Clock size={12} />
										2h ago
									</span>
								</div>
							</div>
							<div class="flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
						</div>
					</div>

					<div class="rounded-lg border border-border bg-surface p-3">
						<div class="mb-2 flex items-start justify-between">
							<div class="flex-1">
								<div class="text-sm font-medium text-foreground">fix(button): outline shadow</div>
								<div class="flex gap-2 mt-1">
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<GitBranch size={12} />
										main
									</span>
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<Clock size={12} />
										4h ago
									</span>
								</div>
							</div>
							<div class="flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
						</div>
					</div>

					<div class="rounded-lg border border-border bg-surface p-3">
						<div class="mb-2 flex items-start justify-between">
							<div class="flex-1">
								<div class="text-sm font-medium text-foreground">feat(alert): redesign</div>
								<div class="flex gap-2 mt-1">
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<GitBranch size={12} />
										develop
									</span>
									<span class="inline-flex items-center gap-1 text-xs text-foreground-muted">
										<Clock size={12} />
										6h ago
									</span>
								</div>
							</div>
							<div class="flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
						</div>
					</div>
				</div>
			</Tabs.Content>

			<!-- Analytics Tab -->
			<Tabs.Content value="analytics" class="space-y-3 pt-4">
				<div class="rounded-lg border border-border bg-surface p-4">
					<div class="flex items-baseline justify-between">
						<div>
							<div class="text-xs font-medium text-foreground-muted mb-1">Visitors</div>
							<div class="text-2xl font-semibold text-foreground">8,210</div>
						</div>
						<div class="flex items-center gap-1 text-xs text-green-600">
							<TrendingUp size={14} />
							+12%
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-border bg-surface p-4">
					<div class="flex items-baseline justify-between">
						<div>
							<div class="text-xs font-medium text-foreground-muted mb-1">Requests</div>
							<div class="text-2xl font-semibold text-foreground">41.3k</div>
						</div>
						<div class="flex items-center gap-1 text-xs text-green-600">
							<TrendingUp size={14} />
							+8%
						</div>
					</div>
				</div>
			</Tabs.Content>

			<!-- Settings Tab -->
			<Tabs.Content value="settings" class="space-y-4 pt-4">
				<div class="rounded-lg border border-border bg-surface p-4">
					<div class="mb-3 flex items-center justify-between">
						<span class="text-sm font-medium text-foreground">Production Branch</span>
						<span class="text-sm text-foreground-muted">main</span>
					</div>
					<div class="text-xs text-foreground-muted">
						Deployments are automatically triggered on pushes to this branch.
					</div>
				</div>

				<div class="rounded-lg border border-border bg-surface px-4 py-3">
					<div class="flex items-center gap-2">
						<CheckCircle2 size={16} class="text-foreground-muted flex-shrink-0" />
						<div class="text-xs text-foreground-muted">Auto-redeploy enabled</div>
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
