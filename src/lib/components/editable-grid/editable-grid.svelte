<script lang="ts">
	import EditableGridCellMergeIndicator from '$lib/components/editable-grid/editable-grid-cell-merge-indicator.svelte';
	import EditableGridCell from '$lib/components/editable-grid/editable-grid-cell.svelte';
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import EditableGridOverlays from '$lib/components/editable-grid/editable-grid-overlays.svelte';
	import { gridContext } from '$lib/components/editable-grid/editable-grid.model';
	import { getCssGridTemplateFromGridLines } from '$lib/components/editable-grid/editable-grid.utils';
	import { setContext } from 'svelte';

	export let grid: EditableGridController;

	setContext(gridContext, grid);

	let lines = grid.lines;
	let cells = grid.cells;
	let overlays = grid.overlays;
</script>

<div
	class="relative grid h-full w-full [--grid-gap:4px]"
	style:grid-template={getCssGridTemplateFromGridLines($lines)}
	bind:this={grid.gridContainer}
	on:mousemove={(event) => grid.events.container.mouseMove.emit(event)}
	role="grid"
	tabindex="0"
>
	{#each $cells as cell}
		<EditableGridCell {cell}>
			<EditableGridCellMergeIndicator {cell} />
		</EditableGridCell>
	{/each}

	<EditableGridOverlays overlays={$overlays} />
</div>
