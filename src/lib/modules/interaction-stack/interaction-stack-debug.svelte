<script lang="ts">
	import { InteractionStack } from './interaction-stack';

	export let interactionStack: InteractionStack;
</script>

<div
	class="pointer-events-none fixed bottom-2 right-2 z-[900] rounded border-2 border-neutral-900 bg-neutral-800 p-4 opacity-50"
>
	{#each $interactionStack.getAll() as interaction}
		<div>
			<div>{interaction.id}</div>
			<div>{interaction.interactionType}</div>
			<div>{interaction.status}</div>
		</div>
	{/each}
</div>
