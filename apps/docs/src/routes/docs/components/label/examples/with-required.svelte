<script lang="ts">
	import { Label } from '@silk/ui/components/label';
	import { Input } from '@silk/ui/components/input';
</script>

<div class="flex flex-col gap-1.5">
	<Label for="name">Full name <span class="text-destructive">*</span></Label>
	<Input id="name" type="text" />
</div>
