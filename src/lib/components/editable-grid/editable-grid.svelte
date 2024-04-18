<script lang="ts">
	import EditableGridCellMergeIndicator from '$lib/components/editable-grid/editable-grid-cell-merge-indicator.svelte';
	import EditableGridCellMergeOverlay from '$lib/components/editable-grid/editable-grid-cell-merge-overlay.svelte';
	import EditableGridCell from '$lib/components/editable-grid/editable-grid-cell.svelte';
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import EditableGridLineResizeIndicator from '$lib/components/editable-grid/editable-grid-line-resize-indicator.svelte';
	import {
		GridLineAxis,
		gridContext,
		gridInteractionStackContext,
		type EditableGridCellData,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		getCssGridTemplateFromGridLines,
		getGroupedGridLines,
	} from '$lib/components/editable-grid/editable-grid.utils';
	import ExampleGridCell from '$lib/components/ui/example-grid-cell/ExampleGridCell.svelte';
	import '$lib/modules/interaction-stack/interaction-stack';
	import { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
	import InteractionStackDebug from '$lib/modules/interaction-stack/interaction-stack-debug.svelte';
	import { setContext } from 'svelte';

	const interactionStack = new InteractionStack();
	setContext(gridInteractionStackContext, interactionStack);

	const colLines = {
		start: {
			name: 'start',
			position: 0,
		},
		mid1: {
			name: 'mid1',
			position: 0.25,
		},
		mid2: {
			name: 'mid2',
			position: 0.5,
		},
		mid3: {
			name: 'mid3',
			position: 0.75,
		},
		end: {
			name: 'end',
			position: 1,
		},
	};

	const rowLines = {
		start: {
			name: 'start',
			position: 0,
		},
		mid1: {
			name: 'mid1',
			position: 0.4,
		},
		mid2: {
			name: 'mid2',
			position: 0.5,
		},
		mid3: {
			name: 'mid3',
			position: 0.7,
		},
		mid4: {
			name: 'mid4',
			position: 0.9,
		},
		end: {
			name: 'end',
			position: 1,
		},
	};

	const initialCells: EditableGridCellData[] = [
		{
			bounds: {
				row: { start: rowLines.start, end: rowLines.mid2 },
				col: { start: colLines.start, end: colLines.mid1 },
			},
			title: 'Cell 1',
			component: ExampleGridCell,
		},
		{
			bounds: {
				row: { start: rowLines.mid2, end: rowLines.mid4 },
				col: { start: colLines.start, end: colLines.mid1 },
			},
			title: 'Cell 2',
		},
		{
			bounds: {
				row: { start: rowLines.mid3, end: rowLines.mid4 },
				col: { start: colLines.mid1, end: colLines.mid3 },
			},
			title: 'Cell 6',
		},
		{
			bounds: {
				row: { start: rowLines.start, end: rowLines.mid3 },
				col: { start: colLines.mid1, end: colLines.mid3 },
			},
			title: 'Cell 3',
		},
		{
			bounds: {
				row: { start: rowLines.start, end: rowLines.mid1 },
				col: { start: colLines.mid3, end: colLines.end },
			},
			title: 'Cell 4',
		},
		{
			bounds: {
				row: { start: rowLines.mid1, end: rowLines.mid4 },
				col: { start: colLines.mid3, end: colLines.end },
			},
			title: 'Cell 5',
		},

		{
			bounds: {
				row: { start: rowLines.mid4, end: rowLines.end },
				col: { start: colLines.start, end: colLines.mid2 },
			},
			title: 'Cell 7',
		},
		{
			bounds: {
				row: { start: rowLines.mid4, end: rowLines.end },
				col: { start: colLines.mid2, end: colLines.end },
			},
			title: 'Cell 8',
		},
	];

	let grid = new EditableGridController(
		{
			col: Object.values(colLines),
			row: Object.values(rowLines),
		},
		initialCells,
	);
	setContext(gridContext, grid);

	let lines = grid.lines;
	let cells = grid.cells;

	$: groupedLines = getGroupedGridLines($lines, $cells);
</script>

<svelte:body on:mouseup={grid.handleDragEnd} on:mousemove={grid.handleDragLine} />

<InteractionStackDebug {interactionStack} />

<div
	class="grid h-full w-full [--grid-gap:4px]"
	style:grid-template={getCssGridTemplateFromGridLines($lines)}
	bind:this={grid.gridContainer}
>
	<EditableGridCellMergeOverlay />

	{#each $cells as cell}
		<EditableGridCell {cell}>
			<!-- <Button size={'sm'} on:click={() => (mergeSource = cell)}>Merge from</Button>
			<Button
				size={'sm'}
				on:click={() => {
					mergeTarget = cell;
				}}>Merge to</Button
			>
			<Button size={'sm'} on:click={() => grid.splitCell(cell, GridLineAxis.Col)}
				>Split Vertically</Button
			>
			<Button size={'sm'} on:click={() => grid.splitCell(cell, GridLineAxis.Row)}
				>Split Horizontally</Button
			> -->
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
