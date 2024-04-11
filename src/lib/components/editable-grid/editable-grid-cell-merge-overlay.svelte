<script lang="ts">
	import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';
	import { getOuterBounds } from '$lib/components/editable-grid/editable-grid.utils';

	export let fromCell: EditableGridCellData;
	export let toCell: EditableGridCellData;
	export let grid: EditableGridController;

	let lines = grid.lines;
	$: bounds = getOuterBounds([fromCell.bounds, toCell.bounds], $lines);
	$: canMerge = grid.canMergeCells(fromCell, toCell);
	$: mergeAxis = grid.findValidCellsMergeAxis(fromCell, toCell);
</script>

<div
	style:grid-row-start={bounds.row.start.name}
	style:grid-row-end={bounds.row.end.name}
	style:grid-column-start={bounds.col.start.name}
	style:grid-column-end={bounds.col.end.name}
	class="z-40 bg-neutral-900 opacity-80"
>
	{mergeAxis}
</div>
