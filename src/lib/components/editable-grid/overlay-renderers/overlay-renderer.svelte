<script lang="ts">
	import {
		OverlayTargetType,
		type EditableGridOverlayData,
	} from '$lib/components/editable-grid/editable-grid-overlay.model';
	import AreasOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/areas-overlay-renderer.svelte';
	import CellsOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/cells-overlay-renderer.svelte';
	import ContainerOverlayRenderer from '$lib/components/editable-grid/overlay-renderers/container-overlay-renderer.svelte';
	import LinesOverlayRendrerer from '$lib/components/editable-grid/overlay-renderers/lines-overlay-renderer.svelte';

	export let overlay: EditableGridOverlayData;
</script>

{#if overlay.targetType === OverlayTargetType.Cells}
	<CellsOverlayRenderer {overlay} />
{/if}
{#if overlay.targetType === OverlayTargetType.Lines}
	<LinesOverlayRendrerer {overlay} />
{/if}
{#if overlay.targetType === OverlayTargetType.Areas}
	<AreasOverlayRenderer {overlay} />
{/if}
{#if overlay.targetType === OverlayTargetType.Container}
	<ContainerOverlayRenderer {overlay} />
{/if}
{#if overlay.targetType === OverlayTargetType.Custom}
	<svelte:component this={overlay.component} {overlay} />
{/if}
