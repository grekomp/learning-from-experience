<script lang="ts">
	import EditableGridCell from '$lib/components/editable-grid/editable-grid-cell.svelte';
	import EditableGridLineResizeIndicator from '$lib/components/editable-grid/editable-grid-line-resize-indicator.svelte';
	import {
		GridLineDirection,
		type DraggingLine,
		type EditableGridCellData,
		type EditableGridLines,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		calculateRelativePosition,
		findLine,
		getContainerSizeInDirection,
		getGridTemplate,
		getGroupedGridLines,
		snapLinePosition,
	} from '$lib/components/editable-grid/editable-grid.utils';

	let gridContainer: HTMLDivElement;

	let gridLines: EditableGridLines = {
		cols: [
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
		rows: [
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
	};

	let cells: EditableGridCellData[] = [
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
	];

	$: groupedLines = getGroupedGridLines(gridLines, cells);

	let draggedLine: DraggingLine | undefined;

	function handleGridLineMouseDown(
		event: MouseEvent,
		lineName: string,
		direction: GridLineDirection,
	) {
		draggedLine = { name: lineName, direction, startX: event.clientX, startY: event.clientY };
	}

	function handleMouseUp() {
		draggedLine = undefined;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!draggedLine) return;

		const relativePosition = calculateRelativePosition(event.clientX, event.clientY, gridContainer);
		const line = findLine(gridLines, draggedLine.name, draggedLine.direction);
		if (!line) return;

		const linesMatchingDirection =
			draggedLine.direction === GridLineDirection.Col ? gridLines.cols : gridLines.rows;
		const linesMatchingDirectionExceptDraggedLine = linesMatchingDirection.filter(
			(line) => line.name !== draggedLine?.name,
		);

		const newPosition =
			draggedLine.direction === GridLineDirection.Col ? relativePosition.x : relativePosition.y;
		const clampedPosition = Math.max(0, Math.min(1, newPosition));

		const snappedPosition = snapLinePosition(
			clampedPosition,
			linesMatchingDirectionExceptDraggedLine,
			getContainerSizeInDirection(draggedLine.direction, gridContainer),
		);

		line.position = snappedPosition;

		gridLines = gridLines;
	}
</script>

<svelte:body on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<div
	class="grid h-full w-full [--grid-gap:2px]"
	style:grid-template={getGridTemplate(gridLines)}
	bind:this={gridContainer}
>
	{#each cells as cell}
		<EditableGridCell bounds={cell.bounds} title={cell.title} />
	{/each}

	{#each groupedLines.cols as line}
		{#key line.name}
			<EditableGridLineResizeIndicator
				lineName={line.name}
				start={line.start}
				end={line.end}
				direction={GridLineDirection.Col}
				isDragged={draggedLine?.name === line.name &&
					draggedLine.direction === GridLineDirection.Col}
				on:mousedown={(event) => handleGridLineMouseDown(event, line.name, GridLineDirection.Col)}
			/>
		{/key}
	{/each}

	{#each groupedLines.rows as line}
		{#key line.name}
			<EditableGridLineResizeIndicator
				lineName={line.name}
				start={line.start}
				end={line.end}
				direction={GridLineDirection.Row}
				isDragged={draggedLine?.name === line.name &&
					draggedLine.direction === GridLineDirection.Row}
				on:mousedown={(event) => handleGridLineMouseDown(event, line.name, GridLineDirection.Row)}
			/>
		{/key}
	{/each}
</div>
