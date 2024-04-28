<script lang="ts">
	import type { EditableGridOverlayData } from '$lib/components/editable-grid/editable-grid-overlay.model';
	import { gridEndLine, gridStartLine } from '$lib/components/editable-grid/editable-grid.model';
	import OverlayRenderer from '$lib/components/editable-grid/overlay-renderers/overlay-renderer.svelte';

	export let overlays: EditableGridOverlayData[];
</script>

<div
	class="pointer-events-none z-[900] grid grid-cols-subgrid grid-rows-subgrid"
	style:grid-row-start={gridStartLine}
	style:grid-row-end={gridEndLine}
	style:grid-column-start={gridStartLine}
	style:grid-column-end={gridEndLine}
>
	{#each overlays as overlay}
		<OverlayRenderer {overlay} />
	{/each}
</div>
