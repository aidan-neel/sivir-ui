<script lang="ts">
	import { CodeBlock } from '@silk/ui/components/code-block';

	const code = `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`;
</script>

<CodeBlock class="max-w-xl" {code} lang="python" showLineNumbers />
