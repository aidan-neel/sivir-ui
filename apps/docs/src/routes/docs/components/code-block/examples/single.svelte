<script lang="ts">
	import { CodeBlock } from '@silk/ui/components/code-block';

	const code = `const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};

console.log(greet('world'));`;
</script>

<CodeBlock class="max-w-xl" {code} lang="typescript" />
