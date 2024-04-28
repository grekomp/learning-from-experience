<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import type {
		EditableGridOverlayDataFor,
		OverlayTargetType,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import { gridContext, gridEvents } from '$lib/components/editable-grid/editable-grid.model';
	import { getContext } from 'svelte';

	const grid = getContext<EditableGridController>(gridContext);

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Cells>;
</script>

{#each overlay.target as cell}
	<div
		style:grid-row-start={cell.bounds.row.start.name}
		style:grid-row-end={cell.bounds.row.end.name}
		style:grid-column-start={cell.bounds.col.start.name}
		style:grid-column-end={cell.bounds.col.end.name}
		style:z-index={overlay.zIndex}
		class="group pointer-events-auto relative"
		on:click={(event) =>
			grid.eventEmitter.emit(gridEvents.cell.click, { originalEvent: event, cell })}
		on:mousemove={(event) =>
			grid.eventEmitter.emit(gridEvents.cell.mouseMove, { originalEvent: event, cell })}
		on:mouseenter={(event) =>
			grid.eventEmitter.emit(gridEvents.cell.mouseEnter, { originalEvent: event, cell })}
		on:mouseleave={(event) =>
			grid.eventEmitter.emit(gridEvents.cell.mouseLeave, { originalEvent: event, cell })}
		role="presentation"
	>
		<svelte:component this={overlay.component} />
	</div>
{/each}
