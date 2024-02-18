<script lang="ts">
	import HeadingRenderer from '$lib/components/markdown/renderers/heading-renderer.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let source: string | null | undefined;
</script>

<SvelteMarkdown
	{source}
	renderers={{
		heading: HeadingRenderer,
	}}
/>
