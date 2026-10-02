<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
</script>

<div class="flex w-full max-w-xl flex-col gap-5">
    <Typography.Text variant="lead">
        Preview deployments build every pull request and post a link in the review.
    </Typography.Text>
    <Typography.Text variant="body">
        Each preview runs against a copy of the staging database. Data you create there is deleted
        when the pull request closes.
    </Typography.Text>
    <Typography.Text variant="supporting">
        Previews older than 30 days are removed automatically.
    </Typography.Text>
    <Typography.Text variant="body">
        Change the base branch in <Typography.InlineCode>preview.config.ts</Typography.InlineCode>.
    </Typography.Text>
</div>
