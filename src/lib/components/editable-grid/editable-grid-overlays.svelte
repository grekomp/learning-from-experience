<script lang="ts">
	import type { EditableGridOverlayData } from '$/lib/components/editable-grid/editable-grid-overlay.model';
	import OverlayRenderer from '$/lib/components/editable-grid/overlay-renderers/overlay-renderer.svelte';

	export let overlays: EditableGridOverlayData[];
</script>

{#each overlays as overlay}
	<OverlayRenderer {overlay} />
{/each}
