<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Learning from experience</title>
	<meta name="description" content="My playground for web technology experiments" />
</svelte:head>

<h1>Learning from experience</h1>
<h2>My playground for web technology experiments</h2>

<Card.Root class="m-4">
	<Card.Header>
		<Card.Title><h1>Learning from experience</h1></Card.Title>
		<Card.Description><h2>My playground for web technology experiments</h2></Card.Description>
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
