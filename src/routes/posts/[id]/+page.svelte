<script lang="ts">
	import Markdown from '$lib/components/markdown/markdown.svelte';

	export let data;
</script>

<header class="mx-auto my-14 flex max-w-5xl flex-col gap-5">
	<h1 class="text-5xl font-black">{data.post.title}</h1>
	<h2 class="max-w-lg text-xl text-muted-foreground">
		{data.post.subtitle}
	</h2>
</header>

<section class="mx-auto flex max-w-5xl flex-col gap-5">
	<Markdown source={data.post.content} />
</section>
