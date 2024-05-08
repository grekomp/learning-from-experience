<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import type {
		EditableGridOverlayDataFor,
		OverlayTargetType,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import { gridContext } from '$lib/components/editable-grid/editable-grid.model';
	import { EditableGridCellMergeDragInteraction } from '$lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction';
	import { getContext } from 'svelte';

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Custom>;

	const grid = getContext<EditableGridController>(gridContext);
	const interactionStack = grid.interactionStack;

	$: interaction = $interactionStack.getByType(EditableGridCellMergeDragInteraction);
	$: fromCell = interaction?.data.fromCell;
	$: toCell = interaction?.data.toCell;

	$: canMerge = fromCell && toCell ? grid.canMergeCells(fromCell, toCell) : false;
</script>

{#if canMerge && toCell}
	<div
		style:grid-row-start={toCell.bounds.row.start.name}
		style:grid-row-end={toCell.bounds.row.end.name}
		style:grid-column-start={toCell.bounds.col.start.name}
		style:grid-column-end={toCell.bounds.col.end.name}
		style:z-index={overlay.zIndex}
		style:pointer-events={overlay.pointerEvents}
		class="z-40 bg-neutral-900 opacity-80"
	></div>
{/if}
