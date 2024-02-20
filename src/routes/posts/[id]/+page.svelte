<script lang="ts">
	import Markdown from '$lib/components/markdown/markdown.svelte';
	import H1 from '$lib/components/ui/basic-html/h1.svelte';

	export let data;
</script>

<div class="mx-4">
	<header class="mx-auto my-14 flex max-w-5xl flex-col gap-5">
		<H1>{data.post.title}</H1>
		<h2 class="max-w-lg text-xl text-muted-foreground">
			{data.post.subtitle}
		</h2>
	</header>

	<section class="mx-auto flex max-w-5xl flex-col gap-5">
		<Markdown source={data.post.content} />
	</section>
</div>
