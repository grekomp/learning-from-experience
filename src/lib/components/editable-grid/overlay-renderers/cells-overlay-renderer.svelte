<script lang="ts">
	import { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
	import type {
		EditableGridOverlayDataFor,
		OverlayTargetType,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import { gridContext } from '$lib/components/editable-grid/editable-grid.model';
	import { getContext } from 'svelte';

	const grid = getContext<EditableGridController>(gridContext);
	let cells = grid.cells;

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Cells>;
	$: target = overlay.target ?? $cells;
</script>

{#each target as cell}
	<div
		style:grid-row-start={cell.bounds.row.start.name}
		style:grid-row-end={cell.bounds.row.end.name}
		style:grid-column-start={cell.bounds.col.start.name}
		style:grid-column-end={cell.bounds.col.end.name}
		style:z-index={overlay.zIndex}
		style:pointer-events={overlay.pointerEvents}
		class="group relative"
		on:click={(event) => grid.events.cell.click.emit({ originalEvent: event, cell })}
		on:mousemove={(event) => grid.events.cell.mouseMove.emit({ originalEvent: event, cell })}
		on:mouseenter={(event) => grid.events.cell.mouseEnter.emit({ originalEvent: event, cell })}
		on:mouseleave={(event) => grid.events.cell.mouseLeave.emit({ originalEvent: event, cell })}
		role="presentation"
	>
		<svelte:component this={overlay.component} />
	</div>
{/each}
