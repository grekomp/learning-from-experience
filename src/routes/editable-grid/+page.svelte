<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import { type EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';
	import EditableGrid from '$lib/components/editable-grid/editable-grid.svelte';
	import ExampleGridCell from '$lib/components/ui/example-grid-cell/ExampleGridCell.svelte';
	import InteractionStackDebug from '$lib/modules/interaction-stack/interaction-stack-debug.svelte';

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

	const grid = new EditableGridController({
		lines: {
			col: Object.values(colLines),
			row: Object.values(rowLines),
		},
		cells: initialCells,
	});
</script>

<div class="flex h-full flex-col content-stretch items-start p-2">
	<InteractionStackDebug interactionStack={grid.interactionStack} />

	<EditableGrid {grid} />
</div>
