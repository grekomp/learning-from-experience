<script lang="ts">
	import type {
	    EditableGridOverlayDataFor,
	    OverlayTargetType,
	} from '$/lib/components/editable-grid/editable-grid-overlay.model';

	export let overlay: EditableGridOverlayDataFor<OverlayTargetType.Areas>;
</script>

{#each overlay.target as bounds}
	<div
		style:grid-row-start={bounds.row.start.name}
		style:grid-row-end={bounds.row.end.name}
		style:grid-column-start={bounds.col.start.name}
		style:grid-column-end={bounds.col.end.name}
		style:z-index={overlay.zIndex}
		style:pointer-events={overlay.pointerEvents}
		class="group relative"
	>
		<svelte:component this={overlay.component} />
	</div>
{/each}
