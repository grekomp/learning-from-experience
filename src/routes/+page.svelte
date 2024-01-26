<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Learning from experience</title>
	<meta name="description" content="My playground for web technology experiments" />
</svelte:head>

<header class="my-14 flex flex-col items-center gap-5 text-center">
	<h1 class="text-6xl font-black">Learning from experience</h1>
	<h2 class="max-w-lg text-xl text-muted-foreground">
		My playground for experimenting with web technologies and docummenting my journey.
	</h2>
</header>

<div class="mx-auto max-w-5xl">
	<Card.Root class="m-4">
		<Card.Header>
			<Card.Title><h2>This is an example of a card</h2></Card.Title>
			<Card.Description><h3>This is an example of a card description</h3></Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				This is a simple SvelteKit application that I'm using to experiment with different web
				technologies, and documment my findings.
			</p>
			<p>
				It will start out as an extremely bare-bones site, and I'll add more features as I check out
				more technologies.
			</p>
		</Card.Content>
		<Card.Footer>
			<Button href="/about">Learn more</Button>
		</Card.Footer>
	</Card.Root>
</div>
