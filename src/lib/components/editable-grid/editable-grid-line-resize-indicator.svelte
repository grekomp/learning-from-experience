<script lang="ts">
	import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import {
		gridEndLine,
		type GridLineAxis,
		type GridLineGroup,
	} from '$lib/components/editable-grid/editable-grid.model';

	export let axis: GridLineAxis;
	export let line: GridLineGroup;
	export let grid: EditableGridController;

	const draggedLine = grid.draggedLine;

	$: isDragged = $draggedLine?.line.name === line.name && $draggedLine?.axis === axis;
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
			on:keydown={(event) => grid.handleLineKeyboardMove(event, line.name, axis)}
			on:mousedown={(event) => grid.handleDragStart(event, line.name, axis)}
		>
			<div
				class="absolute bottom-0 left-0 right-0 top-0 my-auto h-[2px] transition-all group-hover:bg-neutral-400"
				class:bg-neutral-400={isDragged}
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
			on:keydown={(event) => grid.handleLineKeyboardMove(event, line.name, axis)}
			on:mousedown={(event) => grid.handleDragStart(event, line.name, axis)}
		>
			<div
				class="absolute bottom-0 left-0 right-0 top-0 mx-auto w-[2px] transition-all group-hover:bg-neutral-400"
				class:bg-neutral-400={isDragged}
			/>
		</div>
	</div>
{/if}
