<script lang="ts">
	import { CodeBlock } from '@silk/ui/components/code-block';

	const code = `model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(documents)
index.upsert(vectors=zip(ids, embeddings))`;
</script>

<!-- copy="overlay" pins the copy button to the body's top-right (no header). -->
<CodeBlock class="max-w-xl" {code} lang="python" copy="overlay" />
