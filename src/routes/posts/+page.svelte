<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

{#if data.error}
	<p>{data.error.message}</p>
{:else}
	<section class="mx-auto flex max-w-5xl flex-col gap-5">
		{#each data.posts as post}
			<Card.Root>
				<Card.Header>
					<Card.Title>{post.title}</Card.Title>
					<Card.Description>{post.subtitle}</Card.Description>
				</Card.Header>
				<Card.Content>
					{post.content}
				</Card.Content>
				<Card.Footer>
					<Button href={`/posts/${post.id}`} variant="outline">Continue reading</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</section>
{/if}
