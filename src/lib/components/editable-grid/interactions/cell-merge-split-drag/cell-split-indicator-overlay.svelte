<script lang="ts">
	import { EditableGridController } from '$/lib/components/editable-grid/editable-grid-controller';
	import { GridLineAxis, gridContext } from '$/lib/components/editable-grid/editable-grid.model';
	import { EditableGridCellMergeDragInteraction } from '$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction';
	import { calculateSplitPositionAndAxis } from '$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split.utils';
	import { getContext } from 'svelte';

	export let overlay;
	overlay;

	const grid = getContext<EditableGridController>(gridContext);
	$: interaction = $grid.interactionStack.getByType(EditableGridCellMergeDragInteraction);

	$: cell = interaction?.data.fromCell;

	let showLine = false;
	let lineAxis: GridLineAxis;
	let linePosition: number;

	const handleMouseMove = (event: MouseEvent) => {
		if (!interaction) return;
		if (!grid.gridContainer) return;
		if (!cell) return;

		grid.events.cell.mouseMove.emit({ cell, originalEvent: event });

		const { startX, startY } = interaction.data;
		const { clientX, clientY, target } = event;

		if (target instanceof HTMLElement === false) return;

		const splitCoords = calculateSplitPositionAndAxis({
			startX,
			startY,
			clientX,
			clientY,
			target,
			cell,
			grid,
		});

		if (splitCoords == null) {
			showLine = false;
			return;
		}

		lineAxis = splitCoords.axis;
		linePosition = splitCoords.position;

		showLine = true;
	};
</script>

{#if cell}
	<div
		style:grid-row-start={cell.bounds.row.start.name}
		style:grid-row-end={cell.bounds.row.end.name}
		style:grid-column-start={cell.bounds.col.start.name}
		style:grid-column-end={cell.bounds.col.end.name}
		style:z-index={overlay.zIndex}
		style:pointer-events={overlay.pointerEvents}
		class="relative opacity-50"
		on:mousemove={handleMouseMove}
		role="presentation"
	>
		{#if showLine}
			{#if lineAxis === GridLineAxis.Row}
				<div
					style:top={`${linePosition * 100}%`}
					class={`absolute left-0 right-0 h-[2px] bg-accent-foreground`}
				></div>
			{:else}
				<div
					style:left={`${linePosition * 100}%`}
					class={`absolute bottom-0 top-0 w-[2px] bg-accent-foreground`}
				></div>
			{/if}
		{/if}
	</div>
{/if}
