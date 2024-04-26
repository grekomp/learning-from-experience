<script lang="ts">
	import EditableGridCellMergeIndicator from '$lib/components/editable-grid/editable-grid-cell-merge-indicator.svelte';
	import EditableGridCellMergeOverlay from '$lib/components/editable-grid/editable-grid-cell-merge-overlay.svelte';
	import EditableGridCell from '$lib/components/editable-grid/editable-grid-cell.svelte';
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import EditableGridLineResizeIndicator from '$lib/components/editable-grid/editable-grid-line-resize-indicator.svelte';
	import {
		GridLineAxis,
		gridContext,
		gridEvents,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		getCssGridTemplateFromGridLines,
		getGroupedGridLines,
	} from '$lib/components/editable-grid/editable-grid.utils';
	import '$lib/modules/interaction-stack/interaction-stack';
	import { setContext } from 'svelte';

	export let grid: EditableGridController;

	setContext(gridContext, grid);

	let lines = grid.lines;
	let cells = grid.cells;

	$: groupedLines = getGroupedGridLines($lines, $cells);
</script>

<!-- <svelte:body on:mouseup={grid.handleDragEnd} on:mousemove={grid.handleDragLine} /> -->

<div
	class="grid h-full w-full [--grid-gap:4px]"
	style:grid-template={getCssGridTemplateFromGridLines($lines)}
	bind:this={grid.gridContainer}
	on:mousemove={(event) => grid.eventEmitter.emit(gridEvents.container.mouseMove, event)}
	role="grid"
	tabindex="0"
>
	<EditableGridCellMergeOverlay />

	{#each $cells as cell}
		<EditableGridCell {cell}>
			<EditableGridCellMergeIndicator {cell} />
		</EditableGridCell>
	{/each}

	{#each groupedLines.cols as line}
		{#key line.name + 'col'}
			<EditableGridLineResizeIndicator {line} axis={GridLineAxis.Col} {grid} />
		{/key}
	{/each}

	{#each groupedLines.rows as line}
		{#key line.name + 'row'}
			<EditableGridLineResizeIndicator {line} axis={GridLineAxis.Row} {grid} />
		{/key}
	{/each}
</div>
