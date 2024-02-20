<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

{#if data.error}
	<p>{data.error.message}</p>
{:else}
	<section class="mx-auto flex max-w-5xl flex-col gap-5">
		{#each data.posts.sort((a, b) => {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		}) as post}
			<article class="mx-3">
				<Card.Root>
					<Card.Header>
						<Card.Title tag="h2">{post.title}</Card.Title>
						<Card.Description>
							Created on <time datetime={post.created_at}
								>{new Date(post.created_at).toDateString()}</time
							>
						</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if post.subtitle}
							<p class="text-muted-foreground">{post.subtitle}</p>
						{/if}
						{#if post.summary}
							<p>{post.summary}</p>
						{/if}
					</Card.Content>
					<Card.Footer>
						<Button href={`/posts/${post.id}`} variant="outline">Continue reading</Button>
					</Card.Footer>
				</Card.Root>
			</article>
		{/each}
	</section>
{/if}
