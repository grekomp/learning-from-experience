<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Antenna, Grid, SquareStack } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Learning from experience</title>
	<meta name="description" content="My playground for web technology experiments" />
</svelte:head>

<header class="mx-auto my-14 flex max-w-[80%] flex-col items-center gap-5 px-4 text-center">
	<h1 class="text-4xl font-black sm:text-6xl">Learning from experience</h1>
	<h2 class="max-w-lg text-lg text-muted-foreground sm:text-xl">
		My playground for experimenting with web technologies and docummenting my journey.
	</h2>
</header>

<div class="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Grid strokeWidth="1" size="48px" class="mb-2" />

			<Card.Title>Editable Grid</Card.Title>
			<Card.Description
				>A WIP project to implement an editable grid system based on css grid</Card.Description
			>
		</Card.Header>

		<Card.Footer>
			<Button href="/editable-grid">See it in action</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Antenna strokeWidth="1" size="48px" class="mb-2" />

			<Card.Title>Wonder Event Emitter</Card.Title>
			<Card.Description>A small package for defining type-safe event emitters</Card.Description>
		</Card.Header>

		<Card.Footer>
			<Button variant="secondary" href="https://www.npmjs.com/package/@grekomp/wonder-event-emitter"
				>View on npm</Button
			>
		</Card.Footer>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<SquareStack strokeWidth="1" size="48px" class="mb-2" />

			<Card.Title>Wonder Interaction Stack</Card.Title>
			<Card.Description
				>A small package for modeling non-instant user interactions, like drag'n'drop</Card.Description
			>
		</Card.Header>

		<Card.Footer>
			<Button
				variant="secondary"
				href="https://www.npmjs.com/package/@grekomp/wonder-interaction-stack">View on npm</Button
			>
		</Card.Footer>
	</Card.Root>
</div>
