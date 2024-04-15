<script lang="ts">
	import {
		gridInteractionStackContext,
		type EditableGridCellData,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		EditableGridCellMergeDragInteraction,
		editableGridCellMergeDragInteractionType,
	} from '$lib/components/editable-grid/interactions/cell-merge-drag.interaction';
	import { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
	import { cn } from '$lib/utils/shadcn.utils';
	import { getContext } from 'svelte';

	export let cell: EditableGridCellData;

	let interactionStack = getContext<InteractionStack>(gridInteractionStackContext);

	const handleMouseEnter = () => {
		const interaction = interactionStack.getByType<EditableGridCellMergeDragInteraction>(
			editableGridCellMergeDragInteractionType,
		);
		interaction?.setTargetCell(cell);
	};
</script>

<div
	style:grid-row-start={cell.bounds.row.start.name}
	style:grid-row-end={cell.bounds.row.end.name}
	style:grid-column-start={cell.bounds.col.start.name}
	style:grid-column-end={cell.bounds.col.end.name}
	{...$$restProps}
	class={cn(
		'group relative m-[calc(var(--grid-gap)/2)] min-h-0 min-w-0 overflow-auto rounded-sm border-2 border-neutral-900 bg-neutral-800',
		$$props.class,
	)}
	role="cell"
	tabindex="0"
	on:click
	on:mousemove
	on:mouseenter={handleMouseEnter}
>
	{#if cell.title}
		<div
			class="absolute bottom-0 left-0 right-0 top-0 my-auto h-fit text-center text-5xl font-extrabold text-muted-foreground opacity-20"
		>
			{cell.title}
		</div>
	{/if}
	<svelte:component this={cell.component} {cell} />
	<slot />
</div>

<style>
</style>
