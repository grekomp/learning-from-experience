<script lang="ts">
	import { EditableGridController } from '$/lib/components/editable-grid/editable-grid-controller';
	import {
	    GridLineAxis,
	    gridContext,
	    gridLineKeyboardMoveDistance,
	    type LineBounds,
	} from '$/lib/components/editable-grid/editable-grid.model';
	import {
	    getContainerSizeInAxis,
	    getNewLinePosition,
	} from '$/lib/components/editable-grid/editable-grid.utils';
	import { EditableGridLineDragInteraction } from '$/lib/components/editable-grid/interactions/line-drag/line-drag.interaction';
	import { getContext } from 'svelte';

	export let overlay;
	overlay;

	export let lineBounds: LineBounds;

	const grid = getContext<EditableGridController>(gridContext);

	$: axis = $grid.findLineAxis(lineBounds.line);

	let interactionStack = grid.interactionStack;

	$: dragInteraction = $interactionStack.getByType(EditableGridLineDragInteraction);
	$: isDragged =
		dragInteraction?.data?.line?.name === lineBounds.line.name &&
		dragInteraction?.data?.axis === axis;

	const handleMouseDown = () => {
		if (!axis) return;

		const existingInteraction = interactionStack.getByType(EditableGridLineDragInteraction);

		if (existingInteraction) existingInteraction.cancel();

		const gridLine = lineBounds.line;

		const interaction = new EditableGridLineDragInteraction({
			stack: grid.interactionStack,
			initialData: {
				line: gridLine,
				axis,
				grid,
			},
		});
		interaction.start();
	};

	const handleLineKeyboardMove = (event: KeyboardEvent) => {
		if (!axis) return;
		if (!grid.gridContainer) return;
		if (axis === GridLineAxis.Col && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
			return;
		if (axis === GridLineAxis.Row && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

		const gridLine = lineBounds.line;

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
	<!-- TODO: Accessability props -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div
		class="group absolute left-0 right-0 top-[calc(var(--grid-line-area)/-2)] h-[--grid-line-area] cursor-row-resize select-none [--grid-line-area:10px]"
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
			class="absolute bottom-0 left-0 right-0 top-0 my-auto h-[2px] transition-all group-hover:bg-accent"
			class:bg-accent={isDragged}
		/>
	</div>
{:else}
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div
		class="group pointer-events-auto absolute bottom-0 left-[calc(var(--grid-line-area)/-2)] top-0 w-[--grid-line-area] cursor-col-resize select-none [--grid-line-area:10px]"
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
			class="absolute bottom-0 left-0 right-0 top-0 mx-auto w-[2px] transition-all group-hover:bg-accent"
			class:bg-accent={isDragged}
		/>
	</div>
{/if}
