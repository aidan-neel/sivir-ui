<script lang="ts">
	import * as HoverCard from '@silk/ui/components/hover-card';
	import * as Avatar from '@silk/ui/components/avatar';
	import { Button } from '@silk/ui/components/button';
	import Users from '@lucide/svelte/icons/users';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Building from '@lucide/svelte/icons/building';
</script>

<div class="flex items-center justify-center">
	<p class="text-[0.92rem] text-foreground-muted">
		Reviewed by
		<HoverCard.Root>
			<HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
			<HoverCard.Content class="w-60">
				<div class="flex flex-col gap-3">
					<!-- Header: Avatar + Name -->
					<div class="flex items-start gap-3">
						<Avatar.Root size="lg">
							<Avatar.Fallback>AN</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col gap-1">
							<HoverCard.Title class="text-base">Aidan Neel</HoverCard.Title>
							<p class="text-sm text-foreground-muted">@aidan-neel</p>
						</div>
					</div>

					<!-- Bio -->
					<HoverCard.Description class="text-sm leading-relaxed">
						Building Silk — a themeable Svelte component library. Type-driven design & animation
						polish.
					</HoverCard.Description>

					<!-- Meta: Location & Company -->
					<div class="flex flex-col gap-1 text-xs text-foreground-muted">
						<div class="flex items-center gap-1.5">
							<MapPin size={14} />
							<span>Seattle, WA</span>
						</div>
						<div class="flex items-center gap-1.5">
							<Building size={14} />
							<span>Silk Labs</span>
						</div>
					</div>

					<!-- Stats -->
					<div
						class="flex items-center gap-1 text-xs text-foreground-muted border-t border-border pt-2"
					>
						<Users size={14} />
						<span>1.2k followers · 89 following</span>
					</div>

					<!-- Follow Button -->
					<Button variant="secondary" size="sm" class="w-full">Follow</Button>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
		3 days ago.
	</p>
</div>
