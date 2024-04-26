<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import { gridContext } from '$lib/components/editable-grid/editable-grid.model';
	import {
		EditableGridCellMergeDragInteraction,
		editableGridCellMergeDragInteractionType,
	} from '$lib/components/editable-grid/interactions/cell-merge-drag.interaction';
	import { getContext } from 'svelte';

	const grid = getContext<EditableGridController>(gridContext);
	const interactionStack = grid.interactionStack;

	$: interaction = $interactionStack.getByType<EditableGridCellMergeDragInteraction>(
		editableGridCellMergeDragInteractionType,
	);
	$: fromCell = interaction?.data.fromCell;
	$: toCell = interaction?.data.toCell;

	$: canMerge = fromCell && toCell ? grid.canMergeCells(fromCell, toCell) : false;
	$: mergeAxis = fromCell && toCell ? grid.findValidCellsMergeAxis(fromCell, toCell) : null;
</script>

{#if canMerge && toCell}
	<div
		style:grid-row-start={toCell.bounds.row.start.name}
		style:grid-row-end={toCell.bounds.row.end.name}
		style:grid-column-start={toCell.bounds.col.start.name}
		style:grid-column-end={toCell.bounds.col.end.name}
		class="pointer-events-none z-40 bg-neutral-900 opacity-80"
	>
		{mergeAxis}
	</div>
{/if}
