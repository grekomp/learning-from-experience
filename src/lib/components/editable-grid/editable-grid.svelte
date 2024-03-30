<script lang="ts">
	import EditableGridCell from '$lib/components/editable-grid/editable-grid-cell.svelte';
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import EditableGridLineResizeIndicator from '$lib/components/editable-grid/editable-grid-line-resize-indicator.svelte';
	import {
		GridLineDirection,
		type EditableGridCellData,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		getGridTemplate,
		getGroupedGridLines,
	} from '$lib/components/editable-grid/editable-grid.utils';

	let grid = new EditableGridController(
		{
			col: [
				{
					name: 'start',
					position: 0,
				},
				{
					name: 'mid-1',
					position: 0.25,
				},
				{
					name: 'mid-2',
					position: 0.5,
				},
				{
					name: 'mid-3',
					position: 0.75,
				},
				{
					name: 'end',
					position: 1,
				},
			],
			row: [
				{
					name: 'start',
					position: 0,
				},
				{
					name: 'mid-1',
					position: 0.4,
				},
				{
					name: 'mid-2',
					position: 0.5,
				},
				{
					name: 'mid-3',
					position: 0.7,
				},
				{
					name: 'mid-4',
					position: 0.9,
				},
				{
					name: 'end',
					position: 1,
				},
			],
		},
		[
			{
				bounds: {
					row: { start: 'start', end: 'mid-2' },
					col: { start: 'start', end: 'mid-1' },
				},
				title: 'Cell 1',
			},
			{
				bounds: {
					row: { start: 'mid-3', end: 'mid-4' },
					col: { start: 'mid-1', end: 'mid-3' },
				},
				title: 'Cell 6',
			},
			{
				bounds: {
					row: { start: 'mid-2', end: 'mid-4' },
					col: { start: 'start', end: 'mid-1' },
				},
				title: 'Cell 2',
			},
			{
				bounds: {
					row: { start: 'start', end: 'mid-3' },
					col: { start: 'mid-1', end: 'mid-3' },
				},
				title: 'Cell 3',
			},
			{
				bounds: {
					row: { start: 'start', end: 'mid-1' },
					col: { start: 'mid-3', end: 'end' },
				},
				title: 'Cell 4',
			},
			{
				bounds: {
					row: { start: 'mid-1', end: 'mid-4' },
					col: { start: 'mid-3', end: 'end' },
				},
				title: 'Cell 5',
			},

			{
				bounds: {
					row: { start: 'mid-4', end: 'end' },
					col: { start: 'start', end: 'mid-2' },
				},
				title: 'Cell 7',
			},
			{
				bounds: {
					row: { start: 'mid-4', end: 'end' },
					col: { start: 'mid-2', end: 'end' },
				},
				title: 'Cell 8',
			},
		],
	);

	let lines = grid.lines;
	let cells = grid.cells;

	$: groupedLines = getGroupedGridLines($lines, $cells);

	function tmpclick(event: MouseEvent, cell: EditableGridCellData) {
		if (event.ctrlKey) {
			grid.splitCell(cell, GridLineDirection.Row);
		} else {
			grid.splitCell(cell, GridLineDirection.Col);
		}
	}
</script>

<svelte:body on:mouseup={grid.handleDragEnd} on:mousemove={grid.handleDragLine} />

<div
	class="grid h-full w-full [--grid-gap:2px]"
	style:grid-template={getGridTemplate($lines)}
	bind:this={grid.gridContainer}
>
	{#each $cells as cell}
		<EditableGridCell
			bounds={cell.bounds}
			title={cell.title}
			on:click={(event) => tmpclick(event, cell)}
		/>
	{/each}

	{#each groupedLines.cols as line}
		{#key line.name + 'col'}
			<EditableGridLineResizeIndicator {line} direction={GridLineDirection.Col} {grid} />
		{/key}
	{/each}

	{#each groupedLines.rows as line}
		{#key line.name + 'row'}
			<EditableGridLineResizeIndicator {line} direction={GridLineDirection.Row} {grid} />
		{/key}
	{/each}
</div>
