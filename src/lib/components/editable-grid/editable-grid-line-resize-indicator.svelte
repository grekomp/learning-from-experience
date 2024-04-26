<script lang="ts">
	import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import {
		GridLineAxis,
		gridEndLine,
		gridLineKeyboardMoveDistance,
		type GridLineGroup,
	} from '$lib/components/editable-grid/editable-grid.model';
	import {
		getContainerSizeInAxis,
		getNewLinePosition,
	} from '$lib/components/editable-grid/editable-grid.utils';
	import {
		EditableGridLineDragInteraction,
		editableGridLineDragInteractionType,
	} from '$lib/components/editable-grid/interactions/cell-line-drag.interaction';

	export let axis: GridLineAxis;
	export let line: GridLineGroup;
	export let grid: EditableGridController;
	let interactionStack = grid.interactionStack;

	$: dragInteraction = $interactionStack.getByType<EditableGridLineDragInteraction>(
		editableGridLineDragInteractionType,
	);
	$: isDragged =
		dragInteraction?.data?.line?.name === line.name && dragInteraction?.data?.axis === axis;

	const handleMouseDown = () => {
		const existingInteraction = interactionStack.getByType<EditableGridLineDragInteraction>(
			editableGridLineDragInteractionType,
		);

		if (existingInteraction) existingInteraction.cancel();

		const gridLine = grid.findLine(line.name, axis);
		if (!gridLine) return;

		const interaction = new EditableGridLineDragInteraction(grid.interactionStack, {
			line: gridLine,
			axis,
			grid,
		});
		interaction.start();
	};

	const handleLineKeyboardMove = (event: KeyboardEvent) => {
		if (axis === GridLineAxis.Col && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
			return;
		if (axis === GridLineAxis.Row && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

		if (!grid.gridContainer) return;

		const gridLine = grid.findLine(line.name, axis);

		if (!gridLine) return;

		const isIncrement = event.key === 'ArrowRight' || event.key === 'ArrowDown';
		const movementAxisMultiplier = isIncrement ? 1 : -1;
		const pixelPositionOffset = movementAxisMultiplier * gridLineKeyboardMoveDistance;
		const relativePositionOffset =
			pixelPositionOffset / getContainerSizeInAxis(axis, grid.gridContainer);
		const requestedPosition = gridLine.position + relativePositionOffset;

		const newPosition = getNewLinePosition({
			requestedPosition,
			line: gridLine,
			cells: grid.getCells(),
			lines: grid.getLines(),
			axis,
			gridContainer: grid.gridContainer,
		});

		grid.moveLine(gridLine, newPosition);
	};
</script>

{#if axis === 'row'}
	<div
		style:grid-row-start={line.name}
		style:grid-row-end={gridEndLine}
		style:grid-column-start={line.start.name}
		style:grid-column-end={line.end.name}
		class="pointer-events-none relative z-50 [--grid-line-area:10px]"
	>
		<!-- TODO: Accessability props -->
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="group pointer-events-auto absolute left-0 right-0 top-[calc(var(--grid-line-area)/-2)] h-[--grid-line-area] cursor-row-resize select-none"
			role="separator"
			aria-valuenow="34"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-orientation="horizontal"
			tabindex="0"
			on:keydown={handleLineKeyboardMove}
			on:mousedown={handleMouseDown}
		>
			<div
				class="absolute bottom-0 left-0 right-0 top-0 my-auto h-[2px] transition-all group-hover:bg-neutral-900"
				class:bg-neutral-900={isDragged}
			/>
		</div>
	</div>
{:else}
	<div
		style:grid-row-start={line.start.name}
		style:grid-row-end={line.end.name}
		style:grid-column-start={line.name}
		style:grid-column-end={gridEndLine}
		class="pointer-events-none relative z-50 [--grid-line-area:10px]"
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="group pointer-events-auto absolute bottom-0 left-[calc(var(--grid-line-area)/-2)] top-0 w-[--grid-line-area] cursor-col-resize select-none"
			role="separator"
			aria-valuenow="34"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-orientation="vertical"
			tabindex="0"
			on:keydown={handleLineKeyboardMove}
			on:mousedown={handleMouseDown}
		>
			<div
				class="absolute bottom-0 left-0 right-0 top-0 mx-auto w-[2px] transition-all group-hover:bg-neutral-900"
				class:bg-neutral-900={isDragged}
			/>
		</div>
	</div>
{/if}
