<script lang="ts">
	import { Marquee } from '@sivir/ui/components/marquee';
	import { Progress } from '@sivir/ui/components/progress';
	import { Skeleton } from '@sivir/ui/components/skeleton';
	import { Toaster } from '@sivir/ui/components/toast';
</script>

<div data-testid="motion-skeleton"><Skeleton /></div>
<Progress data-testid="motion-progress" indeterminate />
<Marquee data-testid="motion-marquee"><span>Motion</span></Marquee>
<Toaster />
